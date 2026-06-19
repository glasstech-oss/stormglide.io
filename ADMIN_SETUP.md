# Admin Portal Setup

## Authentication

### Admin Account
- **Email:** `admin@stormglide.io`
- **Password:** `admin123`
- **Firebase UID:** `liPZj86NcuO6OxTxfUFh5wHw17x2`

### How It Works
1. Admin login uses Firebase Email/Password authentication
2. On successful login, the user's UID is stored in `sessionStorage` as `stormglide_admin_auth`
3. All protected admin routes check for this UID
4. Email is also stored as `stormglide_admin_email` for reference

### Login Flow
1. User visits `/admin/login`
2. Enters email and password
3. Firebase authenticates the credentials
4. UID is stored in session
5. User is redirected to `/admin/dashboard`
6. ProtectedRoute middleware ensures only authenticated users access admin pages

### Logout
Currently logout is handled by clearing sessionStorage and navigating back to home. The logout button exists in the admin navigation.

### Protected Routes
All admin routes require authentication:
- `/admin/dashboard`
- `/admin/inquiries`
- `/admin/projects`
- `/admin/invoices`
- `/admin/support-tickets`
- `/admin/reports`
- `/admin/infrastructure`

### Client Portal
Separate from admin portal - uses phone+OTP for authentication via Firebase Phone Auth.

---

## Notes
- Admin credentials are stored in Firebase Authentication, not in the app code
- Session is maintained only during the browser session (cleared on close)
- All API access via Firestore is authenticated using the admin UID
