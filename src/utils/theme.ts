export const colors = {
  primary: '#5468FF',       // Bright blue
  secondary: '#6B7FFF',     // Lighter blue
  tertiary: '#384FFF',      // Darker blue
  background: '#FFFFFF',    // White
  surface: '#F7F9FC',       // Very light blue-gray
  error: '#FF6B6B',         // Soft red
  success: '#4BB543',       // Green
  warning: '#FFC145',       // Amber
  info: '#62B6FF',          // Sky blue
  text: '#333746',          // Dark blue-gray
  textLight: '#6E7A94',     // Medium blue-gray
  textDark: '#1B1F2F',      // Very dark blue-gray
  textDisabled: '#A3ADBF',  // Light blue-gray
  textOnPrimary: '#FFFFFF', // White
  border: '#E2E8F0',        // Light gray with blue tint
  divider: '#EDF2F7',       // Very light gray
  white: '#FFFFFF',         // White
  black: '#000000',         // Black
  transparent: 'transparent',
  buttonText: '#FFFFFF',    // White
  placeholder: '#A3ADBF',   // Light blue-gray
  shadow: 'rgba(0, 0, 0, 0.1)', // Transparent black
  darkPurple: '#5E60CE',    // Legacy color (keeping for compatibility)
  lightPurple: '#7B68EE',   // Legacy color (keeping for compatibility)
  accent: '#FF7C7C',        // Legacy color (keeping for compatibility)
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const fontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
  round: 50,
};

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const timing = {
  short: 150,
  medium: 300,
  long: 500,
};

export const zIndex = {
  base: 1,
  elevated: 10,
  modal: 100,
  toast: 1000,
};

export const theme = {
  colors,
  spacing,
  fontSizes,
  fontWeights,
  borderRadius,
  shadows,
  timing,
  zIndex,
}; 