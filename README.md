# GOALI Web App – Project Summary (Auth + Access Layer)

## 🧱 Stack Overview
- **Frontend**: React.js + Vite + TailwindCSS + shadcn/ui
- **Backend**: Node.js + Express.js + Socket.io
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (email/password)
- **Session**: Secure HTTP-only cookies storing JWT
- **Payments**: Stripe (Apple Pay, Google Pay ready)

---

## ✅ Authentication (Completed)
- Supabase email/password signup and login
- Backend API (`/auth/login`) authenticates with Supabase and sets an HTTP-only cookie `sb-access-token`
- Frontend uses `withCredentials: true` to send cookie
- Supabase JWTs verified via backend middleware (`checkAuth.js`)
- Middleware attaches `req.user` to all protected routes

### `checkAuth.js` Highlights
- Parses cookie using `cookie` package
- Verifies token using Supabase’s `auth.getUser()`
- Looks up matching user profile in `users` table (linked by Supabase UID)
- Fails if:
  - Cookie is missing or token expired
  - No matching profile in DB

---

## 🔐 Role-Based Access (Completed)
- `users` table includes `role` (e.g. `client`, `admin`)
- Middleware fetches `role` and attaches to `req.user`
- Separate `requireAdmin` middleware checks role
- Routes like `/admin` can now be secured with:
  ```js
  app.get('/admin', checkAuth, requireAdmin, (req, res) => {...})
  ```

---

## ⚙️ User Profile Creation Flow
- After Supabase signup, backend endpoint `/auth/register-user` is called
- This creates a row in `users` table: `{ id, full_name, role }`
- `id` = Supabase user ID (UUID)
- Enforced via:
  ```sql
  CREATE UNIQUE INDEX ON users (id);
  ```

---

## 🛡️ Supabase Row-Level Security (RLS)
- Enabled on `users` table
- Fixed bug where service role inserts were blocked:
  ```sql
  CREATE POLICY "Allow insert for service role"
  ON users
  FOR INSERT
  TO service_role
  USING (true)
  WITH CHECK (true);
  ```

---

## ✅ Protected Route Example (`/protected`)
```js
app.get('/protected', checkAuth, (req, res) => {
  res.json({
    message: 'You are authorized!',
    user: req.user,
  });
});
```

Frontend fetch:
```js
axios.get('http://localhost:5000/protected', {
  withCredentials: true
})
```

---

## 🔍 Debugging Outcomes
- Cookie was present ✅
- Token validated ✅
- Profile lookup failed → fixed by inserting missing user record ✅
- RLS insert error → fixed with correct Supabase policy ✅

---

## ✅ Next Steps
- Frontend route guards (e.g. redirect `/admin` if not admin)
- Auto-create profiles with Supabase trigger (optional)
- Admin dashboard UI with role-based rendering
- Protect other backend routes with `checkAuth` + `requireAdmin`
- Expand `users` table with avatar, bio, etc.

---

Project status: **Authentication + Role Management = DONE** ✅