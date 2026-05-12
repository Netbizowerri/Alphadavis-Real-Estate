# 🚨 CRITICAL: Status Field Validation Mismatch

## Problem
Your app uses **custom status strings** like:
- `"Pre-Sale Price"`
- `"Pre-Sale Offer"`
- `"Selling Now"`
- Any user-typed value

But your Firestore rules validate status against a **fixed enum**:
```firestore
data.status in ['available', 'sold', 'under_offer', 'off_plan', 'rented', 'featured']
```

**Result:** Every property create/update is denied by `isValidProperty()` because the status doesn't match.

---

## Fix Option A: Relax the rule (quickest)

Remove the status enum restriction entirely from `isValidProperty()`:

```firestore
function isValidProperty(data) {
  return data.keys().hasAll(['title', 'slug', 'propertyType', 'listingType', 'status', 'price', 'coverImageUrl', 'isPublished', 'createdAt']) &&
    data.title is string && data.title.size() <= 200 &&
    data.slug is string && data.slug.size() <= 200 &&
    data.propertyType in ['Apartment', 'Duplex', 'Penthouse', 'Terraced House', 'Detached Villa', 'Commercial', 'Land', 'Short Let'] &&
    data.listingType in ['sale', 'rent', 'shortlet'] &&
    // REMOVE THIS LINE or relax it:
    // data.status in ['available', 'sold', 'under_offer', 'off_plan', 'rented', 'featured'] &&
    data.price is number &&
    data.coverImageUrl is string && data.coverImageUrl.size() <= 1000 &&
    data.isPublished is bool;
}
```

**Or** add your custom statuses to the enum:
```firestore
data.status in ['available', 'sold', 'under_offer', 'off_plan', 'rented', 'featured', 'Pre-Sale Price', 'Pre-Sale Offer', 'Selling Now']
```

---

## Fix Option B: Standardize status values (recommended long-term)

Update your app (constants and PropertyEditor) to use standard statuses:

| Current | Recommended |
|---------|-------------|
| Pre-Sale Price | `off_plan` |
| Pre-Sale Offer | `off_plan` |
| Selling Now | `available` |

Then update the rules to match these standard values.

---

## Immediate Action

1. **Edit your active `firestore.rules`** in Firebase Console or update local file
2. **Remove or expand** the `data.status in [...]` check
3. **Deploy:** `firebase deploy --only firestore:rules`
4. **Test property creation again**

This is likely the **primary cause** of the "Missing or insufficient permissions" error now that the circular dependency is fixed.

---

## Additional Rule Issues to Fix

Your `isValidProperty()` also requires `slug.size() <= 200` — the `generateSlug()` function creates slugs under this limit, that's fine.

But also ensure `coverImageUrl.size() <= 1000` — a Base64 data URL with prefix is typically ~2000+ characters for a compressed image. **This will likely also fail!**

**Fix:** Either increase the limit or remove it:
```firestore
data.coverImageUrl is string  // remove size check
```
Base64 images are ~1-2MB as strings, but Firestore strings can be up to 1MB total document size. The string length check in rules is not necessary — just rely on the 1MB document limit.

---

## Summary of Required Rule Edits

In `isValidProperty()`:

1. **Remove or relax** `data.status in [...]`  ← critical
2. **Remove** `data.coverImageUrl.size() <= 1000`  ← will fail with Base64
3. Keep everything else as-is

Then redeploy rules.

---

## After Fix

1. Clear browser storage
2. Re-login as admin
3. Submit property again

Expected: ✅ Success
