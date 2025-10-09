/**
 * Flying Monkeys Theme: Centralized design tokens for consistent UI.
 * Dark theme optimized for hostile environments and quick readability.
 */

export const theme = {
  // Colors
  colors: {
    // Background
    background: {
      primary: '#0a0a0a',
      secondary: '#1a1a1a',
      tertiary: '#2a2a2a',
    },
    // Borders
    border: {
      subtle: '#222222',
      default: '#333333',
      emphasis: '#555555',
    },
    // Text
    text: {
      primary: '#ffffff',
      secondary: '#cccccc',
      tertiary: '#999999',
      disabled: '#666666',
      muted: '#555555',
    },
    // Status
    status: {
      success: '#00aa00',
      warning: '#ffaa00',
      danger: '#ff4444',
      info: '#00aaff',
    },
    // Accent
    accent: {
      primary: '#00aaff',
      secondary: '#00aa00',
      tertiary: '#ffaa00',
    },
    // Flight path gradient
    flight: {
      low: '#ff4444',
      medium: '#ffaa00',
      high: '#00aa00',
    },
  },

  // Typography
  typography: {
    fontSizes: {
      xs: 10,
      sm: 12,
      base: 14,
      lg: 16,
      xl: 18,
      '2xl': 20,
      '3xl': 24,
      '4xl': 28,
      '5xl': 32,
    },
    fontWeights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeights: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    base: 12,
    md: 16,
    lg: 20,
    xl: 24,
    '2xl': 32,
    '3xl': 40,
    '4xl': 48,
    '5xl': 60,
  },

  // Border Radius
  borderRadius: {
    sm: 4,
    base: 6,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },

  // Shadows (for elevation)
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    base: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
  },

  // Component-specific tokens
  components: {
    button: {
      height: {
        sm: 36,
        base: 44,
        lg: 52,
      },
      paddingHorizontal: {
        sm: 12,
        base: 16,
        lg: 24,
      },
    },
    input: {
      height: 44,
      paddingHorizontal: 16,
      borderWidth: 1,
    },
    card: {
      padding: 16,
      borderWidth: 1,
      borderRadius: 8,
    },
  },

  // Turn Timer specific
  timer: {
    // Duration
    durationSeconds: 4.0,
    warningThresholdSeconds: 3.0,

    // Colors
    normal: '#00aa00',
    warning: '#ff4444',

    // Sizes
    trackHeight: 8,
    beadSize: 12,
    textSize: 14,

    // Animation
    tickIntervalMs: 50,
  },

  // Screen-specific spacing
  screens: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    headerPaddingTop: 60,
  },
} as const;

// Type exports for TypeScript
export type Theme = typeof theme;
export type ThemeColors = typeof theme.colors;
export type ThemeTypography = typeof theme.typography;
export type ThemeSpacing = typeof theme.spacing;
