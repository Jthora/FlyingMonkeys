export const colors = {
  background: '#06080f',
  surface: '#10131f',
  accent: '#f7c948',
  accentMuted: '#b48b2c',
  textPrimary: '#f5f7ff',
  textSecondary: '#98a2c3',
  success: '#2ec27e',
  danger: '#ff5c8d',
  warning: '#ffb347',
  overlay: 'rgba(6, 8, 15, 0.85)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radii = {
  sm: 6,
  md: 10,
  lg: 16,
} as const;

export const typography = {
  display: {
    size: 28,
    weight: '700',
    letterSpacing: 1.2,
  },
  title: {
    size: 20,
    weight: '600',
    letterSpacing: 0.8,
  },
  body: {
    size: 16,
    weight: '400',
    letterSpacing: 0.3,
  },
  caption: {
    size: 13,
    weight: '400',
    letterSpacing: 0.2,
  },
} as const;

export const opacity = {
  disabled: 0.4,
  translucent: 0.75,
} as const;

export type FlyingMonkeysTheme = {
  colors: typeof colors;
  spacing: typeof spacing;
  radii: typeof radii;
  typography: typeof typography;
  opacity: typeof opacity;
};

export const theme: FlyingMonkeysTheme = {
  colors,
  spacing,
  radii,
  typography,
  opacity,
};
