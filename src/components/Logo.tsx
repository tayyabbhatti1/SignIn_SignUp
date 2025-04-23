import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../utils/theme';

interface LogoProps {
  size?: number;
  color?: string;
  backgroundColor?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 120, 
  color = colors.primary,
  backgroundColor = 'rgba(84, 104, 255, 0.08)'
}) => {
  return (
    <View style={[
      styles.container, 
      { 
        width: size, 
        height: size, 
        borderRadius: size / 2,
        backgroundColor: backgroundColor,
        ...shadows.small
      }
    ]}>
      <View style={[
        styles.circle, 
        { 
          width: size * 0.7, 
          height: size * 0.7, 
          borderRadius: size * 0.35,
          backgroundColor: color
        }
      ]}>
        <Ionicons name="shield-checkmark" size={size * 0.38} color="white" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default Logo; 