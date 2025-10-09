/**
 * Enhanced Timer Display: Prominent 4-second timer with visual warnings.
 * Designed for quick glances during high-stress situations.
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {theme} from '@/theme/theme';

interface TimerDisplayProps {
  elapsed: number;
  duration?: number;
  isWarning: boolean;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  elapsed,
  duration = 4.0,
  isWarning,
}) => {
  const progress = Math.min(elapsed / duration, 1);
  const remaining = Math.max(0, duration - elapsed);

  // Color based on warning state
  const color = isWarning ? theme.timer.warning : theme.timer.normal;

  // Calculate percentage
  const percentage = Math.round(progress * 100);

  return (
    <View style={styles.container}>
      {/* Large Time Display */}
      <View style={styles.timeContainer}>
        <Text style={[styles.timeText, {color}]}>{remaining.toFixed(1)}s</Text>
        {isWarning && <Text style={styles.warningText}>NEVER SAY OK</Text>}
      </View>

      {/* Progress Track */}
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            {
              width: `${percentage}%`,
              backgroundColor: color,
            },
          ]}
        />
        {/* Bead Indicator */}
        <View
          style={[
            styles.bead,
            {
              left: `${percentage}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>

      {/* Status Text */}
      <Text style={styles.statusText}>
        {elapsed.toFixed(1)}s / {duration.toFixed(1)}s
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
  },
  timeContainer: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  timeText: {
    fontSize: 48,
    fontWeight: 'bold',
    letterSpacing: -1,
    textAlign: 'center',
  },
  warningText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: 'bold',
    color: theme.timer.warning,
    letterSpacing: 1,
    textAlign: 'center',
  },
  track: {
    height: 16,
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: theme.borderRadius.md,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: theme.colors.border.emphasis,
  },
  fill: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    borderRadius: theme.borderRadius.md,
  },
  bead: {
    position: 'absolute',
    top: -4,
    width: 24,
    height: 24,
    borderRadius: theme.borderRadius.full,
    transform: [{translateX: -12}],
    borderWidth: 3,
    borderColor: theme.colors.background.primary,
  },
  statusText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
  },
});
