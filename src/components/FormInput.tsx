import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  TextInputProps, 
  ViewStyle,
  TextStyle,
  Platform,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, fontSizes, borderRadius, fontWeights } from '../utils/theme';

interface FormInputProps extends TextInputProps {
  label: string;
  icon?: string;
  error?: string | null;
  touched?: boolean;
  isPassword?: boolean;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  errorStyle?: TextStyle;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  icon,
  error,
  touched,
  isPassword,
  containerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  
  const handleFocus = () => {
    setIsFocused(true);
    props.onFocus && props.onFocus(null as any);
  };
  
  const handleBlur = (e: any) => {
    setIsFocused(false);
    props.onBlur && props.onBlur(e);
  };
  
  const showError = error && touched;
  
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[
        styles.label, 
        labelStyle,
        isFocused && styles.labelFocused,
        showError && styles.labelError
      ]}>
        {label}
      </Text>
      
      <View style={[
        styles.inputContainer,
        isFocused && styles.inputContainerFocused,
        showError && styles.inputContainerError,
        props.editable === false && styles.inputContainerDisabled,
      ]}>
        {icon && (
          <Ionicons
            name={icon as any}
            size={20}
            color={showError ? colors.error : isFocused ? colors.primary : colors.textLight}
            style={styles.icon}
          />
        )}
        
        <TextInput
          style={[styles.input, inputStyle]}
          placeholderTextColor={colors.placeholder}
          secureTextEntry={isPassword && !isPasswordVisible}
          onFocus={handleFocus}
          onBlur={handleBlur}
          selectionColor={colors.primary}
          {...props}
        />
        
        {isPassword && (
          <TouchableOpacity 
            onPress={togglePasswordVisibility} 
            style={styles.passwordToggle}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={isFocused ? colors.primary : colors.textLight}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {showError && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={14} color={colors.error} style={styles.errorIcon} />
          <Text style={[styles.errorText, errorStyle]}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
    width: '100%',
  },
  label: {
    fontSize: fontSizes.sm,
    color: colors.textLight,
    marginBottom: spacing.xs,
    fontWeight: fontWeights.medium,
    letterSpacing: 0.2,
  },
  labelFocused: {
    color: colors.primary,
  },
  labelError: {
    color: colors.error,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    minHeight: 54,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputContainerFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.background,
    shadowColor: colors.primary,
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  inputContainerError: {
    borderColor: colors.error,
  },
  inputContainerDisabled: {
    backgroundColor: colors.divider,
    borderColor: colors.border,
    opacity: 0.7,
  },
  icon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: fontSizes.md,
    color: colors.text,
    paddingVertical: Platform.OS === 'ios' ? spacing.sm : spacing.xs,
    fontWeight: fontWeights.regular,
  },
  passwordToggle: {
    padding: spacing.xs,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  errorIcon: {
    marginRight: spacing.xs,
  },
  errorText: {
    color: colors.error,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
  },
});

export default FormInput; 