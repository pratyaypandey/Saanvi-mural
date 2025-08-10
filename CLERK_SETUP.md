# Clerk Authentication Setup

## Overview
This project now uses Clerk for authentication, which provides a much simpler and more robust authentication system with built-in email whitelist functionality.

## Setup Steps

### 1. Create Clerk Account
1. Go to [clerk.com](https://clerk.com) and sign up
2. Create a new application
3. Choose "Next.js" as your framework

### 2. Configure Clerk
1. In your Clerk dashboard, go to **User & Authentication** → **Email, Phone, Username**
2. Enable **Email address** and **Email link** (magic link)
3. Go to **Email Templates** → **Sign in** and customize if needed

### 3. Set Up Email Whitelist
1. Go to **User & Authentication** → **Email addresses**
2. Click **Add email address**
3. Add `pratyayrakesh@gmail.com` to the allowed list
4. Set the email as **Verified**

### 4. Environment Variables
Create a `.env.local` file with your Clerk keys:
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
CLERK_SECRET_KEY=sk_test_your_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/admin
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/admin
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/admin
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/admin
```

### 5. How It Works
1. Users visit `/admin` and see Clerk's built-in sign-in form
2. They enter their email address
3. If the email is whitelisted, they receive a magic link
4. Clicking the link authenticates them and redirects to the admin panel
5. Non-whitelisted emails will not receive magic links

### 6. Benefits of Clerk
- **Built-in UI**: Professional sign-in/sign-up forms
- **Email Whitelist**: Easy to manage allowed users
- **Magic Links**: Secure passwordless authentication
- **Session Management**: Automatic login state handling
- **User Management**: Built-in user dashboard
- **Security**: Enterprise-grade security features

### 7. Testing
1. Start your development server: `npm run dev`
2. Visit `/admin`
3. Try signing in with `pratyayrakesh@gmail.com`
4. Check your email for the magic link
5. Click the link to access the admin panel

## Adding More Users
To add more users to the whitelist:
1. Go to Clerk dashboard → **User & Authentication** → **Email addresses**
2. Add the new email address
3. Set it as **Verified**

## Troubleshooting
- Ensure Clerk environment variables are set correctly
- Check that the email is added to the whitelist in Clerk
- Verify redirect URLs are configured properly
- Check browser console for any errors 