# Supabase Authentication Setup

## Overview
Supabase authentication has been integrated with your AMS-IONIC application. This provides secure sign-up and sign-in functionality with email/password authentication.

## What Was Added

### Files Created:
1. **`.env.local`** - Environment variables with Supabase credentials
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Public anon key for client-side operations

2. **`src/utils/supabaseClient.ts`** - Supabase client initialization
   - Initializes the Supabase client with your credentials
   - Exported as `supabase` for use throughout the app

3. **`src/utils/useAuth.ts`** - Custom React hook for authentication
   - `useAuth()` hook handles session persistence
   - Listens for auth state changes
   - Provides `signOut()` function
   - Auto-populates user data from Supabase

4. **`src/utils/supabaseAuth.ts`** - Helper functions
   - `signOut()` - Sign out current user
   - `getCurrentUser()` - Get current authenticated user

5. **`.gitignore`** - Protects sensitive files from git

### Files Modified:
1. **`src/App.tsx`**
   - Added `useAuth` hook integration
   - Added auth state management
   - Shows loading spinner while checking auth state
   - Added `loading` and `setLoading` to AppContext

2. **`src/context/AppContext.ts`**
   - Added `loading` and `setLoading` to context

3. **`src/pages/LoginPage.tsx`**
   - Replaced local storage auth with Supabase auth
   - Added sign-up functionality with Supabase
   - Added sign-in functionality with Supabase
   - Added form validation (password min 6 chars)
   - Clears form fields after successful auth

4. **`package.json`**
   - Added `@supabase/supabase-js` dependency

## Features

### Sign Up
- Email validation
- Password minimum 6 characters
- Full name field
- User metadata stored in Supabase
- Automatic login after signup

### Sign In
- Email and password validation
- Session persistence
- Auto-login on app reload if session exists

### Session Management
- Automatic session check on app load
- Auth state listener for real-time updates
- Sign-out functionality available via `supabaseAuth.ts`

## How to Use

### In Components
```typescript
import { useAppContext } from '../context/AppContext';

export const MyComponent = () => {
  const { user, loading } = useAppContext();
  
  return (
    <div>
      {loading ? <Spinner /> : <p>Hello {user?.name}</p>}
    </div>
  );
};
```

### Sign Out in Components
```typescript
import { signOut } from '../utils/supabaseAuth';

const handleLogout = async () => {
  await signOut();
};
```

### Custom Auth Hook
```typescript
import { useAuth } from '../utils/useAuth';

export const MyComponent = () => {
  const { user, loading, signOut } = useAuth();
  
  return (
    <div>
      {user ? (
        <button onClick={signOut}>Logout</button>
      ) : (
        <p>Not logged in</p>
      )}
    </div>
  );
};
```

## Security Notes

- `.env.local` is added to `.gitignore` and won't be committed
- The ANON key is public-safe (it's designed for client-side use)
- Row-level security (RLS) should be enabled in Supabase for database tables
- Never commit `.env.local` or any keys to version control

## Next Steps

1. Install dependencies:
   ```bash
   npm install
   ```

2. Enable database tables (if needed):
   - Go to Supabase Dashboard > SQL Editor
   - Create tables for learners and other data
   - Enable Row-Level Security (RLS) on tables

3. Test authentication:
   - Start the dev server: `npm run dev`
   - Try signing up with a test email
   - Test sign-in with the same credentials
   - Refresh page to verify session persistence

4. Add logout button to HomePage or navigation:
   ```typescript
   import { signOut } from '../utils/supabaseAuth';
   
   const handleLogout = async () => {
     await signOut();
   };
   ```

## Troubleshooting

### "Missing Supabase environment variables"
- Ensure `.env.local` exists in the project root
- Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set

### Auth not persisting after refresh
- Clear browser cache and cookies
- Check browser console for errors
- Verify Supabase session is enabled in project settings

### Sign-up fails
- Check password length (minimum 6 characters)
- Verify email format
- Check Supabase Dashboard > Auth > Users for any issues

## Useful Supabase Dashboard Links
- Auth settings: Dashboard > Authentication > Policies
- User management: Dashboard > Authentication > Users
- Database: Dashboard > SQL Editor
- Real-time: Dashboard > Database > Tables > Enable Realtime

