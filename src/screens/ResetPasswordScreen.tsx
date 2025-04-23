import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import FormInput from '../components/FormInput';
import Button from '../components/Button';
import Logo from '../components/Logo';
import { colors, spacing, fontSizes, borderRadius, fontWeights } from '../utils/theme';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { validateCode, validatePassword, validateConfirmPassword } from '../utils/validation';

interface ResetPasswordScreenProps {
  navigation: any;
  route: {
    params: {
      email: string;
    };
  };
}

const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({ navigation, route }) => {
  const { email } = route.params;
  const { confirmForgotPassword, isAuthenticating } = useAuth();
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { formState, handleSubmit } = useForm({
    code: {
      initialValue: '',
      validate: validateCode,
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

  const handleResetPassword = async (values: { code: string; password: string }) => {
    if (isSubmitting) return; // Prevent multiple submissions
    
    setGeneralError(null);
    setIsSubmitting(true);
    
    try {
      await confirmForgotPassword(email, values.code, values.password);
      navigation.navigate('SignIn', { resetSuccess: true });
    } catch (error: any) {
      setGeneralError(error.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const isLoading = isSubmitting || isAuthenticating;
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
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleGoBack}
            activeOpacity={0.7}
            // Don't disable back button during form submission
          >
            <Ionicons name="arrow-back-outline" size={24} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Logo size={80} />
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Enter the verification code sent to{'\n'}
              <Text style={styles.emailText}>{email}</Text>
            </Text>
          </View>

          <View style={styles.formContainer}>
            {generalError && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={20} color={colors.error} />
                <Text style={styles.errorText}>{generalError}</Text>
              </View>
            )}

            <FormInput
              label="Verification Code"
              placeholder="Enter 6-digit code"
              keyboardType="number-pad"
              maxLength={6}
              icon="key-outline"
              value={formState.code.value}
              onChangeText={formState.code.onChange}
              error={formState.code.error}
              touched={formState.code.touched}
              onBlur={formState.code.onBlur}
              editable={!isDisabled}
            />

            <FormInput
              label="New Password"
              placeholder="Create a new password"
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
              placeholder="Confirm your new password"
              icon="lock-closed-outline"
              isPassword
              value={formState.confirmPassword.value}
              onChangeText={formState.confirmPassword.onChange}
              error={formState.confirmPassword.error}
              touched={formState.confirmPassword.touched}
              onBlur={formState.confirmPassword.onBlur}
              editable={!isDisabled}
            />

            <Button
              title="Reset Password"
              onPress={() => handleSubmit(handleResetPassword)}
              isLoading={isLoading}
              fullWidth
              size="large"
              style={styles.resetButton}
              disabled={isDisabled}
            />

            <TouchableOpacity 
              style={styles.backToSignInContainer} 
              onPress={() => navigation.navigate('SignIn')}
              disabled={isDisabled}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back-outline" size={16} color={colors.primary} style={styles.backIcon} />
              <Text style={styles.backToSignInText}>Back to Sign In</Text>
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
  backButton: {
    marginBottom: spacing.lg,
    padding: spacing.xs,
    alignSelf: 'flex-start',
    borderRadius: borderRadius.round,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.bold,
    color: colors.textDark,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  emailText: {
    fontWeight: fontWeights.bold,
    color: colors.primary,
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
  resetButton: {
    marginTop: spacing.lg,
  },
  backToSignInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
    padding: spacing.xs,
  },
  backIcon: {
    marginRight: spacing.xs,
  },
  backToSignInText: {
    fontSize: fontSizes.md,
    color: colors.primary,
    fontWeight: fontWeights.medium,
  },
});

export default ResetPasswordScreen; 