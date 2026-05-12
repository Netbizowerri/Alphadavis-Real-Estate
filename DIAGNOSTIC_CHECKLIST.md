# 🔥 FIREBASE RULES DIAGNOSTIC CHECKLIST

## Step 1: Verify Admin Document Exists in Firestore

**Go to:** Firebase Console → Firestore → Data

**Collection:** `admins`
**Document ID:** `24FlMQ4Vk1gE2U0sBPNNkmhauOH3`

✅ **DOES IT EXIST?** Yes / No

**Document fields must include:**
```json
{
  "fullName": "AlphaDavis Admin",
  "email": "alphadavisrealestate@gmail.com",
  "role": "super_admin",
  "isActive": true,
  "createdAt": {"_seconds": ..., "_nanoseconds": ...}
}
```

---

## Step 2: Verify Auth User UID

**Go to:** Firebase Console → Authentication → Users

Find user with email `alphadavisrealestate@gmail.com`

**Copy the UID** and verify it matches exactly: `24FlMQ4Vk1gE2U0sBPNNkmhauOH3`

✅ **UID MATCHES?** Yes / No

---

## Step 3: Check Current Deployed Rules

Run in terminal:
```bash
firebase firestore:rules get
```

**Look for this line in the output:**
```rules
match /admins/{adminId} {
  allow read: if request.auth != null && adminId == request.auth.uid;
  ...
}
```

✅ **IS THE LINE PRESENT?** Yes / No

If you see `allow read: if isAdmin();` instead → **RULES NOT DEPLOYED** — deploy now.

---

## Step 4: Deploy Rules Immediately

```bash
cd C:\Users\EMMY-TECH\alphadavis-real-estate-limited
firebase deploy --only firestore:rules
```

Wait for "Deploy complete!" message.

---

## Step 5: Test in Rules Playground

**Firebase Console → Firestore → Rules → Rules Playground**

**Test A: Read own admin doc**
```
Auth UID: 24FlMQ4Vk1gE2U0sBPNNkmhauOH3
Operation: get
Path: /admins/24FlMQ4Vk1gE2U0sBPNNkmhauOH3
```
**Result should be:** `true` ✅ / ❌

**Test B: Create property**
```
Auth UID: 24FlMQ4Vk1gE2U0sBPNNkmhauOH3
Operation: create
Path: /properties/test456
Request data:
{
  "title": "Test Prop",
  "slug": "test-prop",
  "propertyType": "Apartment",
  "listingType": "sale",
  "status": "available",
  "price": 1000000,
  "coverImageUrl": "https://example.com/img.jpg",
  "isPublished": true,
  "createdAt": {"__type__": "ServerTimestamp"}
}
```
**Result should be:** `true` ✅ / ❌

---

## Step 6: Clear Browser State & Retry

1. Open browser DevTools (F12)
2. Application → Storage → Clear all (cookies, local storage, session storage)
3. Log out of admin if still logged in
4. Log back in with `alphadavisrealestate@gmail.com`
5. Try adding property again

---

## Step 7: Check Browser Console for Exact Error

If it still fails, open **DevTools → Console** and look for:

- `FirebaseError: [code=permission-denied]` messages
- The full error stack trace

Also check **Network tab** → filter "firestore" → find the failed request → inspect **Response** for the exact rule path that failed.

---

## Step 8: Check Document Size (1MB Limit)

Base64 images can exceed Firestore's 1MB document limit.

**Check in Network tab:**
- Find the Firestore `commit` request
- Look at **Request Payload** size
- If > 1MB → Document too large

**Fix:** Reduce image size:
- Change `compressImageToBase64` quality from `0.7` to `0.4`
- Change `maxWidth` from `1200` to `800`
- Or store images in external hosting (ibb.co, Cloudinary) instead of Base64

---

## Step 9: Check for Unauthorized Property Types

The rules validate `propertyType` and `listingType` and `status` are in allowed lists.

**In PropertyEditor.tsx line 123:** propertyTypes list must match rules exactly.

**Rules expect:**
- `propertyType`: "Apartment", "Duplex", "Penthouse", "Terraced House", "Detached Villa", "Commercial", "Land", "Short Let"
- `listingType`: "sale", "rent", "shortlet"
- `status`: "available", "sold", "under_offer", "off_plan", "rented", "featured"

**Your form uses (line 123 & 125):**
```typescript
const propertyTypes = ['Apartment', 'Duplex', 'Penthouse', 'Terraced House', 'Detached Villa', 'Commercial', 'Land', 'Short Let'];
// listingType options: sale, rent, shortlet
// status: any string (user types freely)
```

⚠️ **MISMATCH:** Your `status` field allows **any string** (user types e.g. "Pre-Sale Price" from SEED_PROPERTIES), but rules only allow specific enums: `"available", "sold", "under_offer", "off_plan", "rented", "featured"`.

This will cause `isValidProperty()` to fail.

**Fix in PropertyEditor.tsx:**
Change status from free-text input to a **select dropdown** with the allowed values, OR update the rules to accept any string for status.

---

## Step 10: Final Corrected Rules (If not yet deployed)

If your current `firestore.rules` does NOT have the fix on line 90, replace `/admins/{adminId}` block with:

```rules
match /admins/{adminId} {
  // Allow users to read their own admin doc (breaks circular dependency)
  allow read: if request.auth != null && adminId == request.auth.uid;
  // Write requires admin + super_admin role
  allow write: if isAdmin() &&
    get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.role == 'super_admin';
}
```

Also fix `isValidProperty` to accept your actual status values or make status a free string.

---

## 📞 IF ALL ELSE FAILS

1. **Share:**
   - Screenshot of admin document from Firestore (show document ID and fields)
   - Screenshot of Auth user UID
   - Output from Rules Playground Test A & B
   - Browser console error

2. **Temporarily set rules to:** `allow read, write: if true;` and test
   - If it works → 100% rules issue
   - If still fails → client-side issue

---

## ✅ QUICK ACTION ORDER

1. **Deploy rules** (`firebase deploy --only firestore:rules`)
2. **Clear browser storage** and re-login
3. **Check admin doc UID** matches Auth UID
4. **Fix status field** validation mismatch
5. **Retest**

**The most likely culprits:**
- ❌ Rules not deployed (most common)
- ❌ Admin document ID ≠ Firebase Auth UID (second most common)
- ❌ `status` field value not in allowed enum list (third most common)
