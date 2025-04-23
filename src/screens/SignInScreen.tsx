import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import FormInput from '../components/FormInput';
import Button from '../components/Button';
import SocialButton from '../components/SocialButton';
import Logo from '../components/Logo';
import { colors, spacing, fontSizes, borderRadius, shadows, fontWeights } from '../utils/theme';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { validateEmail, validatePassword } from '../utils/validation';

interface SignInScreenProps {
  navigation: any;
}

const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
  const { signIn, isAuthenticating, signInWithGoogle, signInWithApple } = useAuth();
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState(false);

  const { formState, handleSubmit } = useForm({
    email: {
      initialValue: '',
      validate: validateEmail,
    },
    password: {
      initialValue: '',
      validate: validatePassword,
    },
  });

  const handleSignIn = async (values: { email: string; password: string }) => {
    if (isSubmitting) return; // Prevent multiple submissions
    
    setGeneralError(null);
    setIsSubmitting(true);
    
    try {
      await signIn(values.email, values.password);
      // Navigation to home screen will be handled by the AuthProvider
    } catch (error: any) {
      setGeneralError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSocialLoading(true);
    setGeneralError(null);
    try {
      await signInWithGoogle();
    } catch (error: any) {
      setGeneralError(error.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setIsSocialLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setIsSocialLoading(true);
    setGeneralError(null);
    try {
      await signInWithApple();
    } catch (error: any) {
      if (error.message !== 'Apple authentication is not available on this device') {
        setGeneralError(error.message || 'Failed to sign in with Apple. Please try again.');
      }
    } finally {
      setIsSocialLoading(false);
    }
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const isLoading = isSubmitting || isAuthenticating || isSocialLoading;
  const isDisabled = isLoading;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Logo size={100} />
            <Text style={styles.title}>Banki</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>
          </View>

          <View style={styles.formContainer}>
            {generalError && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={20} color={colors.error} />
                <Text style={styles.errorText}>{generalError}</Text>
              </View>
            )}

            <FormInput
              label="Email"
              placeholder="Your email address"
              keyboardType="email-address"
             autoCapitalize="none"
              icon="mail-outline"
              value={formState.email.value}
              onChangeText={formState.email.onChange}
              error={formState.email.error}
              touched={formState.email.touched}
              onBlur={formState.email.onBlur}
              editable={!isDisabled}
            />

            <FormInput
              label="Password"
              placeholder="Your password"
              icon="lock-closed-outline"
              isPassword
              value={formState.password.value}
              onChangeText={formState.password.onChange}
              error={formState.password.error}
              touched={formState.password.touched}
              onBlur={formState.password.onBlur}
              editable={!isDisabled}
            />

            <TouchableOpacity 
              style={styles.forgotPasswordContainer} 
              onPress={handleForgotPassword}
              disabled={isDisabled}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button
              title="Sign In"
              onPress={() => handleSubmit(handleSignIn)}
              isLoading={isSubmitting || isAuthenticating}
              fullWidth
              size="large"
              disabled={isDisabled}
              style={styles.signInButton}
            />

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.socialButtonsContainer}>
              <SocialButton
                title="Sign in with Google"
                iconName="logo-google"
                onPress={handleGoogleSignIn}
                backgroundColor="#FFFFFF"
                textColor="#333"
                iconColor="#DB4437"
                style={styles.socialButton}
                isLoading={isSocialLoading}
                disabled={isDisabled}
              />

              <SocialButton
                title="Sign in with Apple"
                iconName="logo-apple"
                onPress={handleAppleSignIn}
                backgroundColor="#000000"
                style={styles.socialButton}
                isLoading={isSocialLoading}
                disabled={isDisabled}
              />
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity 
              onPress={handleSignUp} 
              disabled={isDisabled}
              activeOpacity={0.7}
            >
              <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: spacing.xl,
    paddingTop: Platform.OS === 'ios' ? spacing.lg : spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.bold,
    color: colors.textDark,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: colors.textLight,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: borderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  errorText: {
    color: colors.error,
    marginLeft: spacing.sm,
    fontSize: fontSizes.sm,
    flex: 1,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: spacing.xl,
    padding: spacing.xs,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
  },
  signInButton: {
    marginTop: spacing.sm,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: spacing.md,
    color: colors.textLight,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
  },
  socialButtonsContainer: {
    marginTop: spacing.md,
  },
  socialButton: {
    marginBottom: spacing.md,
    ...shadows.small,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingVertical: spacing.xl,
  },
  footerText: {
    fontSize: fontSizes.md,
    color: colors.textLight,
  },
  signUpText: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
});

export default SignInScreen; 