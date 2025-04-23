# Modern Authentication App

A sleek, minimalist authentication system with email/password, social sign-in, and multi-factor authentication built with React Native and Expo.

## Features

- Clean, modern UI with consistent design system
- Email/password authentication
- Google Sign-In integration
- Apple Sign-In for iOS
- AWS Cognito backend
- Account verification with email codes
- Password recovery flow
- Form validation
- Accessibility features

## Screenshots

![Sign In Screen](./screenshots/signin.png)
![Sign Up Screen](./screenshots/signup.png)
![Verification Screen](./screenshots/verification.png)

## Setup

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- AWS account (for Cognito)
- Google Cloud Platform account (for Google Sign-In)
- Apple Developer account (for Apple Sign-In)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
cd SignIn_SignUp
npm install
```

### Running the app

```bash
npx expo start
```

## AWS Cognito Setup

Follow these steps to properly set up AWS Cognito authentication:

1. **Create an AWS account** if you don't have one (https://aws.amazon.com/)

2. **Create a Cognito User Pool:**
   - Sign in to the AWS Management Console
   - Go to Amazon Cognito
   - Click "Create user pool"
   - For Cognito user pool sign-in options: Select "Email"
   - For User name requirements: Choose "Allow users to sign in with email"
   - Multi-factor authentication: Choose your preferred setting
   - Configure security requirements: Use Cognito defaults or customize
   - For Account recovery: Choose "Enable self-service account recovery"
   - For Required attributes: Choose "email" and "name" (minimum)
   - For Email provider: Choose "Send email with Cognito" for testing
   - Name your user pool (e.g., "SignInSignUpUserPool")
   - For Initial app client: Choose "Public client"
   - For App client name: Enter "SignInSignUpAppClient"
   - Under App type, select "Public client"
   - Important: In Authentication flows, make sure "ALLOW_USER_PASSWORD_AUTH" is selected
   - Review and create your user pool

3. **Get Cognito information:**
   - Note your "User Pool ID" (e.g., us-east-1_abcdefg)
   - Note the "Region" (e.g., us-east-1)
   - From the App integration tab, get your "Client ID"

4. **Configure your app:**
   - Update the Cognito configuration in `src/amplifyconfiguration.ts`:

```typescript
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'YOUR_USER_POOL_ID',       // Replace with your User Pool ID
      userPoolClientId: 'YOUR_USER_POOL_CLIENT_ID', // Replace with your App Client ID
      loginWith: {
        email: true,
      },
    }
  }
});
```

5. **Email Verification Setup:**
   - For production, configure Amazon SES for email delivery
   - In testing/development, you must verify any email addresses you use with SES
   - Go to SES console and click "Verify a New Email Address"
   - Follow the verification link in your email

## Google Sign-In Setup

1. **Create a Google Cloud Project:**
   - Go to https://console.cloud.google.com/
   - Create a new project or select an existing one
   - Go to APIs & Services > Library
   - Enable the "Google Identity" API

2. **Create OAuth Credentials:**
   - Go to APIs & Services > Credentials
   - Click "Create Credentials" > "OAuth client ID"
   - For Application type: Select "Web application" (for development)
   - Name your client
   - Add Authorized JavaScript origins:
     - For development: `https://localhost:19006`
     - For Expo: `https://auth.expo.io`
   - Add Authorized redirect URIs:
     - For Expo: `https://auth.expo.io/@your-username/your-app-slug`
   - Click "Create"
   - Note your "Client ID"

3. **Configure for iOS/Android:**
   - Create additional OAuth client IDs for iOS and Android platforms
   - For iOS: Use your app's Bundle ID
   - For Android: Use your app's Package name and SHA-1 signing certificate

4. **Update your app configuration:**
   - Open `src/services/SocialAuthService.ts`
   - Update the Google client IDs:

```typescript
const GOOGLE_CLIENT_ID_IOS = 'YOUR_IOS_CLIENT_ID';
const GOOGLE_CLIENT_ID_ANDROID = 'YOUR_ANDROID_CLIENT_ID';
const GOOGLE_CLIENT_ID_WEB = 'YOUR_WEB_CLIENT_ID';
```

## Apple Sign-In Setup

Apple Sign-In is only required for iOS apps and is mandatory for App Store approval if your app offers other social sign-in options.

1. **Register an App ID:**
   - Go to https://developer.apple.com/account/resources/identifiers/list
   - Click the "+" button to add a new identifier
   - Select "App IDs" and click "Continue"
   - Choose "App" and click "Continue"
   - Enter a description and your Bundle ID
   - Scroll down to "Capabilities" and select "Sign In with Apple"
   - Click "Continue" and then "Register"

2. **Configure Sign In with Apple:**
   - In your Xcode project, enable the "Sign In with Apple" capability
   - Make sure your provisioning profile includes this capability

3. **The app is pre-configured to use Apple Sign-In**
   - No additional code changes are needed
   - This feature will only work on actual iOS devices (not in Expo Go)

## Troubleshooting

### Common issues with AWS Cognito:

1. **"User not confirmed" error:**
   - The user exists but hasn't verified their email
   - Resend the verification code
   - For testing, you can manually confirm users in the AWS Console

2. **Email verification not working:**
   - Check your spam folder
   - Make sure your email is verified in SES if in the sandbox
   - Review Cognito logs for error messages

3. **"NotAuthorizedException: Incorrect username or password":**
   - Double-check credentials
   - Ensure ALLOW_USER_PASSWORD_AUTH is enabled in Cognito app client

### Google Sign-In issues:

1. **"Invalid client" error:**
   - Verify your client IDs
   - Make sure the right origins/redirect URIs are configured

2. **Redirect not working:**
   - Check that your Expo app slug matches the redirect URI
   - Ensure you've enabled the correct APIs

## License

This project is licensed under the MIT License.

## Acknowledgements

- [Expo Auth Session](https://docs.expo.dev/versions/latest/sdk/auth-session/)
- [AWS Amplify Authentication](https://docs.amplify.aws/lib/auth/getting-started/q/platform/js/)
- [React Native](https://reactnative.dev/) 