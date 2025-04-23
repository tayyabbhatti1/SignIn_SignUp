import { Amplify } from 'aws-amplify';

// Mock configuration that doesn't depend on real AWS services
export const configureAmplify = () => {
  // Use empty configuration to prevent API calls to AWS
  Amplify.configure({
    // This is an intentionally minimal configuration 
    // that won't try to connect to real AWS services
  });
}; 