import React from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  ViewStyle, 
  TextStyle, 
  ActivityIndicator 
} from 'react-native';

import { colors, spacing, fontSizes, borderRadius, shadows, fontWeights } from '../utils/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  loadingColor?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  loadingColor,
}) => {
  const getButtonStyles = () => {
    const buttonStyles: ViewStyle[] = [styles.button];
    
    // Variant styles
    switch (variant) {
      case 'primary':
        buttonStyles.push(styles.primaryButton);
        break;
      case 'secondary':
        buttonStyles.push(styles.secondaryButton);
        break;
      case 'outline':
        buttonStyles.push(styles.outlineButton);
        break;
      case 'ghost':
        buttonStyles.push(styles.ghostButton);
        break;
    }
    
    // Size styles
    switch (size) {
      case 'small':
        buttonStyles.push(styles.smallButton);
        break;
      case 'medium':
        buttonStyles.push(styles.mediumButton);
        break;
      case 'large':
        buttonStyles.push(styles.largeButton);
        break;
    }
    
    // Width styles
    if (fullWidth) {
      buttonStyles.push(styles.fullWidth);
    }
    
    // Disabled styles
    if (disabled) {
      buttonStyles.push(styles.disabledButton);
    }
    
    return buttonStyles;
  };
  
  const getTextStyles = () => {
    const textStyles: TextStyle[] = [styles.text];
    
    // Variant text styles
    switch (variant) {
      case 'primary':
        textStyles.push(styles.primaryText);
        break;
      case 'secondary':
        textStyles.push(styles.secondaryText);
        break;
      case 'outline':
        textStyles.push(styles.outlineText);
        break;
      case 'ghost':
        textStyles.push(styles.ghostText);
        break;
    }
    
    // Size text styles
    switch (size) {
      case 'small':
        textStyles.push(styles.smallText);
        break;
      case 'medium':
        textStyles.push(styles.mediumText);
        break;
      case 'large':
        textStyles.push(styles.largeText);
        break;
    }
    
    // Disabled text styles
    if (disabled) {
      textStyles.push(styles.disabledText);
    }
    
    return textStyles;
  };
  
  const getLoadingColor = () => {
    if (loadingColor) return loadingColor;
    
    switch (variant) {
      case 'primary':
      case 'secondary':
        return colors.white;
      case 'outline':
      case 'ghost':
        return colors.primary;
      default:
        return colors.white;
    }
  };
  
  return (
    <TouchableOpacity
      style={[getButtonStyles(), style]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator color={getLoadingColor()} size="small" />
      ) : (
        <Text style={[getTextStyles(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  ghostButton: {
    backgroundColor: 'transparent',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  smallButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    minHeight: 36,
  },
  mediumButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    minHeight: 44,
  },
  largeButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    minHeight: 54,
  },
  fullWidth: {
    width: '100%',
  },
  disabledButton: {
    opacity: 0.6,
    backgroundColor: colors.disabledButton || colors.textDisabled,
  },
  text: {
    textAlign: 'center',
    fontWeight: fontWeights.medium,
    letterSpacing: 0.3,
  },
  primaryText: {
    color: colors.white,
  },
  secondaryText: {
    color: colors.white,
  },
  outlineText: {
    color: colors.primary,
  },
  ghostText: {
    color: colors.primary,
  },
  smallText: {
    fontSize: fontSizes.sm,
  },
  mediumText: {
    fontSize: fontSizes.md,
  },
  largeText: {
    fontSize: fontSizes.lg,
  },
  disabledText: {
    color: colors.white,
  },
});

export default Button; 