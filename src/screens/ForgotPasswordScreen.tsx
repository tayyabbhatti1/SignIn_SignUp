import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Image,
  ActivityIndicator,
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
import { validateEmail } from '../utils/validation';

interface ForgotPasswordScreenProps {
  navigation: any;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const { forgotPassword, isAuthenticating } = useAuth();
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { formState, handleSubmit, isFormValid } = useForm({
    email: {
      initialValue: '',
      validate: validateEmail,
    },
  });

  const handleForgotPassword = async (values: { email: string }) => {
    if (isSubmitting || isAuthenticating) return; // Prevent multiple submissions
    
    setGeneralError(null);
    setIsSubmitting(true);
    
    try {
      await forgotPassword(values.email);
      navigation.navigate('ResetPassword', { email: values.email });
    } catch (error: any) {
      setGeneralError(error.message || 'Failed to send reset code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const isLoading = isSubmitting || isAuthenticating;
  const isDisabled = isLoading || !isFormValid();

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
          <View style={styles.content}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={handleGoBack}
              activeOpacity={0.7}
              // Don't disable the back button even during submission
            >
              <Ionicons name="arrow-back-outline" size={24} color={colors.text} />
            </TouchableOpacity>

            <View style={styles.header}>
              <Logo size={80} />
              <Text style={styles.title}>Forgot Password?</Text>
              <Text style={styles.subtitle}>
                Enter your email address and we'll send you a code to reset your password
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
                editable={!isLoading}
              />

              <Button
                title="Send Reset Code"
                onPress={() => handleSubmit(handleForgotPassword)}
                isLoading={isLoading}
                fullWidth
                size="large"
                style={styles.sendButton}
                disabled={isDisabled}
              />

              <TouchableOpacity 
                style={styles.backToSignInContainer} 
                onPress={() => navigation.navigate('SignIn')}
                disabled={isLoading}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back-outline" size={16} color={colors.primary} style={styles.backIcon} />
                <Text style={styles.backToSignInText}>Back to Sign In</Text>
              </TouchableOpacity>
            </View>
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
  },
  content: {
    flex: 1,
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
    marginBottom: spacing.xxl,
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
    marginHorizontal: spacing.lg,
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
  sendButton: {
    marginTop: spacing.lg,
  },
  backToSignInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xxl,
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

export default ForgotPasswordScreen; 