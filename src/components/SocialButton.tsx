import React from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  ViewStyle, 
  TextStyle,
  ActivityIndicator,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, fontSizes, borderRadius, fontWeights } from '../utils/theme';

interface SocialButtonProps {
  title: string;
  iconName: string;
  onPress: () => void;
  backgroundColor?: string;
  textColor?: string;
  iconColor?: string;
  style?: ViewStyle;
  isLoading?: boolean;
  disabled?: boolean;
}

const SocialButton: React.FC<SocialButtonProps> = ({
  title,
  iconName,
  onPress,
  backgroundColor = colors.primary,
  textColor = colors.white,
  iconColor = colors.white,
  style,
  isLoading = false,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor },
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.75}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <>
          <View style={styles.iconContainer}>
            <Ionicons name={iconName} size={20} color={iconColor} />
          </View>
          <Text style={[styles.title, { color: textColor }]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 54,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  disabledButton: {
    opacity: 0.7,
  },
  iconContainer: {
    marginRight: spacing.sm,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    letterSpacing: 0.3,
  },
});

export default SocialButton; 