# Environment Variables Setup Guide

## The Issue

The error message `client_id is required` indicates that your OAuth environment variables are not properly set up. This guide will help you create and configure the necessary environment variables for your Todo Next.js App.

## Step 1: Create a .env.local file

Create a file named `.env.local` in the root directory of your project (same level as package.json) with the following content:

```
# MongoDB
MONGODB_URI=your_mongodb_uri_here

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# OAuth Providers
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

GITHUB_ID=your_github_client_id_here
GITHUB_SECRET=your_github_client_secret_here
```

## Step 2: Set up Google OAuth credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Select "Web application" as the application type
6. Add a name for your OAuth client
7. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
8. Add authorized redirect URIs:
   - `http://localhost:3000/api/nextauth/callback/google` (for development)
9. Click "Create"
10. Copy the generated Client ID to your `.env.local` file as `GOOGLE_CLIENT_ID`
11. Copy the generated Client Secret to your `.env.local` file as `GOOGLE_CLIENT_SECRET`

## Step 3: Set up GitHub OAuth credentials

1. Go to your GitHub account settings
2. Navigate to "Developer settings" > "OAuth Apps"
3. Click "New OAuth App"
4. Fill in the application details:
   - Application name: "Todo App" (or your preferred name)
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/nextauth/callback/github`
5. Click "Register application"
6. Generate a new client secret
7. Copy the Client ID to your `.env.local` file as `GITHUB_ID`
8. Copy the Client Secret to your `.env.local` file as `GITHUB_SECRET`

## Step 4: Generate secrets for JWT and NextAuth

Generate secure random strings for your JWT_SECRET and NEXTAUTH_SECRET:

```bash
# On Windows (in PowerShell)
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# On macOS/Linux
openssl rand -base64 32
```

Copy the output to your `.env.local` file as `JWT_SECRET` and `NEXTAUTH_SECRET`.

## Step 5: Verify your environment variables

Make sure:
1. There are no spaces around the equal signs (=)
2. All values are properly filled in
3. The file is saved in the root directory of your project

## Step 6: Restart your development server

After setting up your `.env.local` file:

1. Stop your current development server (Ctrl+C in the terminal)
2. Start it again:

```bash
npm run dev
```

## Troubleshooting

If you still encounter issues:

1. **Check port number**: If you're running on a different port (e.g., 3001), update your OAuth redirect URLs and NEXTAUTH_URL accordingly
2. **Verify file location**: Make sure `.env.local` is in the root directory
3. **Check for typos**: Double-check all variable names and values
4. **Restart completely**: Sometimes a full restart of the development server is needed
5. **Browser cache**: Try clearing your browser cache or using an incognito window 