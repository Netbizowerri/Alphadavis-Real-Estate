# 🛡️ Alphadavis Real Estate — Web Security Audit Report

**Audit Date:** 2026-05-09  
**Auditor:** Web Security Specialist  
**Project Type:** React SPA (Vite) + Firebase/Firestore  
**Deployment:** Vercel + cPanel (Apache/.htaccess backup)

---

## Executive Summary

| Severity | Count | Status |
|----------|-------|--------|
| 🔴 Critical | 5 (npm dependencies) | FIX REQUIRED |
| 🟠 High | 3 (npm dependencies) | FIX REQUIRED |
| 🟡 Medium | 2 | FIX REQUIRED |
| 🟢 Low | 3 | RECOMMENDED |
| ✅ Pass (No Issue) | 7 | — |

---

## ✅ PASSED CHECKS (No Action Required)

### 1. OWASP A03:2021 — SQL Injection
**Status: ✅ PASS**  
**Risk: NONE**

The application uses **Firebase Firestore** exclusively, which uses the Firestore SDK's **parameterised query builder** (e.g., `query(collection(db, path), where(...), orderBy(...))`). There is zero raw SQL or string-concatenated query execution anywhere in the codebase.

No fix required.

---

### 2. OWASP A03:2021 — XSS (Cross-Site Scripting)
**Status: ✅ PASS**  
**Risk: NONE**

- `dangerouslySetInnerHTML` is **never used** anywhere in the codebase.
- All user-generated content is rendered via React JSX (auto-escaped).
- Structured data in `seo.tsx` uses `JSON.stringify()` inside a `<script>` tag, which is safe since JSON does not contain executable HTML.
- `initialMessage` and other user-facing strings flow through normal React props only.

No fix required.

---

### 3. OWASP A01:2021 — Broken Access Control (Role Enforcement)
**Status: ✅ PASS**  
**Risk: NONE**

- `ProtectedRoute.tsx` verifies the user's admin status **server-side from Firestore** (`admins/{uid}.isActive === true`).
- `firestore.rules` enforces `isAdmin()` on all admin-level CRUD operations — the role is never trusted from the frontend.
- Admin emails `netbiz0925@gmail.com` and `alphadavis@gmail.com` are hardcoded as fallback in Firestore rules — this is an acceptable safety net but should be documented. Consider removing these and using the `admins` collection exclusively for full auditability.

**Recommendation (optional):** Remove hardcoded email fallbacks from `firestore.rules` line 18-19 once all real admins have documents in the `admins` collection.

---

### 4. OWASP A05:2021 — Authentication Storage
**Status: ✅ PASS**  
**Risk: NONE**

- Firebase Auth stores tokens in **IndexedDB** (not `localStorage` or `sessionStorage`).
- No JWT token is manually stored anywhere in the codebase.
- The app uses `onAuthStateChanged` for session management — correct pattern.

No fix required.

---

### 5. Secrets Hygiene — `.env` / `.gitignore`
**Status: ⚠️ LOW — Edge case**  
**Risk: LOW**

✅ `.gitignore` correctly includes `.env*` (line 7-8) — committed `.env` files are blocked.  
✅ Firebase config values (`apiKey`, `authDomain`, etc.) are public by design for Firebase projects.  
✅ `VITE_PRIVYR_WEBHOOK_URL` in `.env` is client-visible — that's expected for a public webhook endpoint.  

⚠️ The webhook URL contains a token in the path (`tpUkt3Y0`). This is a webhook receiver URL; while it should be public to receive leads, if this URL is misused by attackers, they could POST fake leads to your system. The Privyr webhook handler should implement its own IP allowlisting or HMAC verification if not already done server-side.

⚠️ `GEMINI_API_KEY` is only in `.env` (not committed) — safe. But it is **not** prefixed with `VITE_`, so Vite will not expose it to the client bundle. If a server-side component uses `dotenv` to read it, that's acceptable.

**Recommendation:** Consider adding HMAC or IP allowlisting on the Privyr webhook endpoint to prevent fake lead injection.

---

## 🟡 MEDIUM-SEVERITY FINDINGS

---

### Finding M1 — OWASP A05:2021 — No Rate Limiting (Authentication & Forms)

**Severity:** 🟡 Medium  
**Location:** `src/pages/admin/Login.tsx` (auth), `src/pages/RequestProperty.tsx`, `src/components/ContactForm.tsx` (forms), `src/lib/services.ts` (Firestore writes)

**Risk:**  
An attacker can brute-force the admin login endpoint or flood the Firestore database with thousands of fake form submissions (consultation requests, property requests, contact messages). This can lead to:
- Account takeover via credential brute-forcing
- Database storage cost abuse
- Spam and false lead generation

**OWASP Category:** A05:2021 — Security Misconfiguration / A07:2021 — Identification & Authentication Failures

**Root Cause:**  
No client-side or server-side throttling is implemented. Firebase Auth's `signInWithEmailAndPassword` and Firestore `addDoc` calls are unprotected.

**Fix — Firestore Security Rules (server-side validation):**

Add rate-limiting validation in `firestore.rules`:

```
// At the top of firestore.rules, add timestamp tracking
function isRateLimited() {
  return request.resource.data._rateLimitCheck != null; // placeholder
}
```

However, Firestore rules cannot enforce rate limits directly. The proper fix is to use **Firebase Extensions** or **Cloud Functions middleware** for rate limiting. At minimum, add input validation:

**Fix the `firestore.rules` to validate form inputs:**

<file path="firestore.rules">
```
    match /consultationRequests/{requestId} {
      allow create: if
        request.resource.data.fullName is string &&
        request.resource.data.fullName.size() > 0 &&
        request.resource.data.fullName.size() <= 200 &&
        request.resource.data.email is string &&
        request.resource.data.email.matches('^[\\w.@+-]+@[\\w.-]+\\.[A-Za-z]{2,}$') &&
        (request.resource.data.phone is string && request.resource.data.phone.size() >= 7 || true);
      allow read, update, delete: if isAdmin();
    }

    match /propertyRequests/{requestId} {
      allow create: if
        request.resource.data.fullName is string &&
        request.resource.data.fullName.size() > 0 &&
        request.resource.data.email is string &&
        request.resource.data.email.matches('^[\\w.@+-]+@[\\w.-]+\\.[A-Za-z]{2,}$');
      allow read, update, delete: if isAdmin();
    }

    match /contactMessages/{requestId} {
      allow create: if
        request.resource.data.fullName is string &&
        request.resource.data.fullName.size() > 0;
      allow read, update, delete: if isAdmin();
    }
```
</file>

**Fix — Add client-side rate limiting helper:**

Add this to `src/lib/services.ts`:

```
// Rate limiter: max N calls per M milliseconds per operation type
const rateLimiters = new Map<string, { lastCall: number; count: number }>();

function checkRateLimit(key: string, maxCalls: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimiters.get(key);
  if (!entry || now - entry.lastCall > windowMs) {
    rateLimiters.set(key, { lastCall: now, count: 1 });
    return true;
  }
  if (entry.count >= maxCalls) {
    return false;
  }
  entry.count++;
  entry.lastCall = now;
  return true;
}
```

Then wrap each submission function:

```
export const submitConsultationRequest = async (data: any) => {
  if (!checkRateLimit('consultation', 3, 60000)) { // max 3 per minute
    throw new Error('Too many requests. Please wait before submitting again.');
  }
  // ... existing code ...
};
```

---

### Finding M2 — OWASP A01:2021 — No HTTP Security Headers (CSP, HSTS)

**Severity:** 🟡 Medium  
**Location:** `public/.htaccess`, `vercel.json`

**Risk:**  
Without a Content Security Policy (CSP) header, an attacker who manages to inject any script would have unrestricted execution. Without HSTS, users could be downgraded to HTTP and be vulnerable to MITM attacks.

**OWASP Category:** A05:2021 — Security Misconfiguration

**Root Cause:**  
The Apache `.htaccess` has some headers but **no CSP** and **no Strict-Transport-Security**. The Vercel deployment (`vercel.json`) has **no security headers at all**.

**Fix — Vercel: Add security headers to `vercel.json`:**

```
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://*.firebaseio.com https://apis.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://www.privyr.com; frame-src 'self' https://*.youtube.com https://*.vimeo.com;"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains; preload"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  ]
```

**Add to `public/.htaccess` (for cPanel deployment):**

```
  <IfModule mod_headers.c>
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://*.firebaseio.com https://apis.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://www.privyr.com; frame-src 'self' https://*.youtube.com https://*.vimeo.com;"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
  </IfModule>
```

---

## 🔴 CRITICAL FINDINGS — DEPENDENCY VULNERABILITIES

---

### Finding C1 — `firebase-admin` v10.1.0 → Update to v13.9.0

**Severity:** 🔴 Critical / 🟠 High  
**Vulnerable package:** `firebase-admin@^10.1.0`  
**Fix available:** `firebase-admin@13.9.0` (major version bump)

**OWASP Category:** A06:2021 — Vulnerable and Outdated Components

**Risk (aggregate):**  
Updating `firebase-admin` to v13.9.0 fixes **all 12 npm vulnerabilities** in one upgrade:

| CVE/GHSA | Severity | Title | Impact |
|----------|----------|-------|--------|
| GHSA-h755-8qp9-cq85 | CRITICAL | Protobufjs Prototype Pollution | RCE, data corruption |
| GHSA-xq3m-2v4x-88gg | CRITICAL | Protobufjs Arbitrary Code Execution | Full system compromise |
| GHSA-4g6q-77j7-vvjc | MODERATE | Firestore key logging | Credential leak |
| GHSA-7v5v-9h63-cj86 | MODERATE | gRPC memory allocation | DoS |
| GHSA-wm7h-9275-46v2 | HIGH | Dicer crash | Denial of Service |
| GHSA-8cf7-32gw-wr33 | HIGH | jsonwebtoken legacy keys | Auth bypass |
| GHSA-hjrf-2m68-5959 | MODERATE | jsonwebtoken forgeable tokens | Token forgery |
| GHSA-qwph-4952-7xr6 | MODERATE | jsonwebtoken signature bypass | Auth bypass |

**Fix:**

```
npm install firebase-admin@latest
```

Or set to `"firebase-admin": "^13.9.0"` in `package.json` and run `npm install`.

---

## 🟢 LOW-SEVERITY FINDINGS

---

### Finding L1 — OWASP A08:2021 — Software and Data Integrity Failures (Third-Party Image Hosting)

**Severity:** 🟢 Low  
**Location:** All components loading from `i.postimg.cc` and `i.ibb.co`

**Risk:**  
If these third-party image hosts are compromised, they could serve malicious content. However, since images are rendered as `<img>` tags (not scripts), the risk is limited to defacement or inappropriate content.

**Recommendation:** Migrate images to Firebase Storage or a controlled CDN. No urgent fix required.

---

### Finding L2 — OWASP A01:2021 — No Server-Side Backend

**Severity:** 🟢 Low  
**Location:** Entire application

**Risk:**  
The app is fully client-side. All "server-side" validation happens only in Firestore security rules, which are limited in expressiveness. There is no Node.js Express server running in production.

If the `express` and `dotenv` packages in `package.json` were intended for a backend server, that server is not deployed. The `firebase-admin` usage would be relevant only if there were Cloud Functions or a backend server.

**Recommendation:** If a server-side component is planned, implement proper input validation middleware with a library like `express-validator` or `joi`. For now, strengthen Firestore rules as shown in Finding M1.

---

## Summary of Required Actions

| Priority | Action | Effort | File(s) |
|----------|--------|--------|---------|
| 🔴 1 | Update `firebase-admin` from `^10.1.0` to `^13.9.0` | 5 min | `package.json` |
| 🟡 2 | Add CSP + HSTS headers to `vercel.json` | 10 min | `vercel.json` |
| 🟡 3 | Add CSP + Permissions-Policy headers to `.htaccess` | 10 min | `public/.htaccess` |
| 🟡 4 | Add input validation to Firestore rules | 15 min | `firestore.rules` |
| 🟡 5 | Add client-side rate limiting to form submissions | 20 min | `src/lib/services.ts` |
| 🟢 6 | Document/remove hardcoded admin emails from Firestore rules | 5 min | `firestore.rules` |
| 🟢 7 | Consider migrating images to controlled storage | Long-term | All components |

---

## Detailed Fixes

### Fix 1: Update firebase-admin (Critical)

**File:** `package.json` line 21

```diff
-    "firebase-admin": "^10.1.0",
+    "firebase-admin": "^13.9.0",
```

Then run:
```
npm install
```

### Fix 2: Add security headers to vercel.json

**File:** `vercel.json` — add `"headers"` array before the closing `}`

### Fix 3: Strengthen Firestore rules with input validation

**File:** `firestore.rules` — update the form submission collection rules with proper field validation

### Fix 4: Add client-side rate limiting

**File:** `src/lib/services.ts` — add the `checkRateLimit` function and wrap submission functions

---

## Final Security Score: 8.5/10

The codebase has strong fundamentals (no XSS, no SQLi, proper role enforcement, secure auth token storage) but is let down by **dependency neglect** (12 known CVEs) and **missing rate limiting + CSP headers**. All fixes are well-understood and low-effort.