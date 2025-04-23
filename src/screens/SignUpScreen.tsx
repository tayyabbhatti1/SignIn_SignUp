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
import { validateEmail, validatePassword, validateName, validateConfirmPassword } from '../utils/validation';

interface SignUpScreenProps {
  navigation: any;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const { signUp, isAuthenticating, signInWithGoogle, signInWithApple } = useAuth();
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState(false);

  const { formState, handleSubmit } = useForm({
    name: {
      initialValue: '',
      validate: validateName,
    },
    email: {
      initialValue: '',
      validate: validateEmail,
    },
    password: {
      initialValue: '',
      validate: validatePassword,
    },
    confirmPassword: {
      initialValue: '',
      validate: (value) => validateConfirmPassword(formState?.password?.value || '', value),
    },
  });

  const handleSignUp = async (values: { name: string; email: string; password: string }) => {
    if (isSubmitting) return; // Prevent multiple submissions
    
    setGeneralError(null);
    setIsSubmitting(true);
    
    try {
      await signUp(values.email, values.password, values.name);
      navigation.navigate('ConfirmSignUp', { email: values.email });
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

  const handleSignIn = () => {
    navigation.navigate('SignIn');
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
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
              disabled={isDisabled}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back-outline" size={24} color={colors.text} />
            </TouchableOpacity>
            
            <Logo size={80} />
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join us today</Text>
          </View>

          <View style={styles.formContainer}>
            {generalError && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={20} color={colors.error} />
                <Text style={styles.errorText}>{generalError}</Text>
              </View>
            )}

            <FormInput
              label="Full Name"
              placeholder="Your full name"
              autoCapitalize="words"
              icon="person-outline"
              value={formState.name.value}
              onChangeText={formState.name.onChange}
              error={formState.name.error}
              touched={formState.name.touched}
              onBlur={formState.name.onBlur}
              editable={!isDisabled}
            />

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
              placeholder="Create a password"
              icon="lock-closed-outline"
              isPassword
              value={formState.password.value}
              onChangeText={formState.password.onChange}
              error={formState.password.error}
              touched={formState.password.touched}
              onBlur={formState.password.onBlur}
              editable={!isDisabled}
            />

            <FormInput
              label="Confirm Password"
              placeholder="Confirm your password"
              icon="lock-closed-outline"
              isPassword
              value={formState.confirmPassword.value}
              onChangeText={formState.confirmPassword.onChange}
              error={formState.confirmPassword.error}
              touched={formState.confirmPassword.touched}
              onBlur={formState.confirmPassword.onBlur}
              editable={!isDisabled}
            />

            <Text style={styles.termsText}>
              By signing up, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>

            <Button
              title="Sign Up"
              onPress={() => handleSubmit(handleSignUp)}
              isLoading={isSubmitting}
              fullWidth
              size="large"
              style={styles.signUpButton}
              disabled={isDisabled}
            />

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.socialButtonsContainer}>
              <SocialButton
                title="Sign up with Google"
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
                title="Sign up with Apple"
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
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity 
              onPress={handleSignIn} 
              disabled={isDisabled}
              activeOpacity={0.7}
            >
              <Text style={styles.signInText}>Sign In</Text>
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
    marginBottom: spacing.xl,
    position: 'relative',
    paddingTop: spacing.md,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: spacing.md,
    zIndex: 1,
    padding: spacing.xs,
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
  termsText: {
    fontSize: fontSizes.sm,
    color: colors.textLight,
    marginVertical: spacing.md,
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: fontWeights.medium,
  },
  signUpButton: {
    marginTop: spacing.xs,
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
  signInText: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
});

export default SignUpScreen; 