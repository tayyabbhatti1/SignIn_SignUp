import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import FormInput from '../components/FormInput';
import Button from '../components/Button';
import Logo from '../components/Logo';
import { colors, spacing, fontSizes, borderRadius } from '../utils/theme';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { validateCode } from '../utils/validation';

interface ConfirmSignUpScreenProps {
  navigation: any;
  route: {
    params: {
      email: string;
    };
  };
}

const ConfirmSignUpScreen: React.FC<ConfirmSignUpScreenProps> = ({ navigation, route }) => {
  const { email } = route.params;
  const { confirmSignUp, resendConfirmationCode, isAuthenticating } = useAuth();
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const { formState, handleSubmit } = useForm({
    code: {
      initialValue: '',
      validate: validateCode,
    },
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleConfirmSignUp = async (values: { code: string }) => {
    if (isSubmitting) return; // Prevent multiple submissions
    
    setGeneralError(null);
    setIsSubmitting(true);
    
    try {
      await confirmSignUp(email, values.code);
      navigation.navigate('SignIn', { confirmSuccess: true });
    } catch (error: any) {
      setGeneralError(error.message || 'Failed to confirm. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (isResending) return;
    
    setGeneralError(null);
    setResendDisabled(true);
    setIsResending(true);
    setCountdown(30); // 30 seconds cooldown
    
    try {
      await resendConfirmationCode(email);
    } catch (error: any) {
      setGeneralError(error.message || 'Failed to resend code. Please try again.');
      setResendDisabled(false);
      setCountdown(0);
    } finally {
      setIsResending(false);
    }
  };

  const isLoading = isSubmitting || isAuthenticating || isResending;
  const isDisabled = isLoading;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.content}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
            disabled={isDisabled}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Logo size={80} />
            <Text style={styles.title}>Verify Your Email</Text>
            <Text style={styles.subtitle}>
              We've sent a verification code to{'\n'}
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

            <Button
              title="Verify"
              onPress={() => handleSubmit(handleConfirmSignUp)}
              isLoading={isSubmitting}
              fullWidth
              size="large"
              style={styles.verifyButton}
              disabled={isDisabled}
            />

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't receive the code? </Text>
              {countdown > 0 ? (
                <Text style={styles.countdownText}>Resend in {countdown}s</Text>
              ) : (
                <TouchableOpacity 
                  onPress={handleResendCode} 
                  disabled={resendDisabled || isDisabled}
                >
                  <Text style={[
                    styles.resendLink,
                    (resendDisabled || isDisabled) && styles.disabledText
                  ]}>
                    Resend Code
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
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
  content: {
    flex: 1,
    padding: spacing.xl,
  },
  backButton: {
    marginBottom: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: 'bold',
    color: colors.primary,
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
    fontWeight: 'bold',
    color: colors.text,
  },
  formContainer: {
    width: '100%',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: '#FFEBEE',
    borderRadius: borderRadius.md,
  },
  errorText: {
    color: colors.error,
    marginLeft: spacing.sm,
    fontSize: fontSizes.sm,
    flex: 1,
  },
  verifyButton: {
    marginVertical: spacing.lg,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  resendText: {
    fontSize: fontSizes.md,
    color: colors.textLight,
  },
  resendLink: {
    fontSize: fontSizes.md,
    fontWeight: 'bold',
    color: colors.primary,
  },
  countdownText: {
    fontSize: fontSizes.md,
    color: colors.textLight,
    fontWeight: '500',
  },
  disabledText: {
    color: colors.placeholder,
  },
});

export default ConfirmSignUpScreen; 