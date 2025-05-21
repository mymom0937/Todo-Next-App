# OAuth Setup Instructions

To enable Google and GitHub authentication in your Todo Next.js App, follow these steps:

## 1. Create a `.env.local` file

Create a `.env.local` file in the root of your project with the following variables:

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

## 2. Set up Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Select "Web application" as the application type
6. Add a name for your OAuth client
7. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - Your production URL when deployed
8. Add authorized redirect URIs:
   - `http://localhost:3000/api/nextauth/callback/google` (for development)
   - `https://your-production-url.com/api/nextauth/callback/google` (for production)
9. Click "Create"
10. Copy the generated Client ID and Client Secret to your `.env.local` file

## 3. Set up GitHub OAuth

1. Go to your GitHub account settings
2. Navigate to "Developer settings" > "OAuth Apps"
3. Click "New OAuth App"
4. Fill in the application details:
   - Application name: "Todo App" (or your preferred name)
   - Homepage URL: `http://localhost:3000` (or your production URL)
   - Authorization callback URL: `http://localhost:3000/api/nextauth/callback/github`
5. Click "Register application"
6. Generate a new client secret
7. Copy the Client ID and Client Secret to your `.env.local` file

## 4. Set up NextAuth Secret

Generate a random string for NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```
Copy the output to your `.env.local` file as NEXTAUTH_SECRET.

## 5. Set up JWT Secret

Generate another random string for JWT_SECRET:
```bash
openssl rand -base64 32
```
Copy the output to your `.env.local` file as JWT_SECRET.

## 6. Troubleshooting

If you encounter issues with OAuth login:

1. **Check your environment variables**: Make sure all variables are correctly set in `.env.local`
2. **URL mismatch**: Ensure the callback URLs in your OAuth provider settings match exactly with your app URLs
3. **Port issues**: If you're running on a different port (e.g., 3001), update your callback URLs accordingly
4. **Browser console errors**: Check your browser's developer console for any errors
5. **Server logs**: Check the terminal output for server-side errors

## 7. Start your application

Once you've set up all the environment variables, start your application:

```bash
npm run dev
```

Now you should be able to sign in with Google and GitHub accounts! 