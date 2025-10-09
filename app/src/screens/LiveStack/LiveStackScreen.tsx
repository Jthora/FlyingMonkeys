import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

import {useSessionStore} from '@/state/useSessionStore';
import {useCamoStore} from '@/state/useCamoStore';
import {TurnEngine} from '@/turn/TurnEngine';
import {CamouflageCurtain} from '@/components/CamouflageCurtain';

export const LiveStackScreen = (): React.JSX.Element => {
  const {
    currentCard,
    upcomingCards,
    heatPlayer,
    flightPath,
    timerElapsed,
    isWarning,
    advanceCard,
    currentFlow,
    currentIndex,
    heatOpponent,
    updateTimer,
  } = useSessionStore();
  const {activate: activateCamo} = useCamoStore();

  const [lastTap, setLastTap] = useState(0);
  const engineRef = useRef<TurnEngine | null>(null);

  // Initialize TurnEngine on mount
  useEffect(() => {
    const engine = new TurnEngine();

    // Wire up tick callback to update session store
    engine.onTick((elapsed, warning) => {
      updateTimer(elapsed, warning);
    });

    // Wire up expire callback to auto-advance
    engine.onExpire(() => {
      advanceCard();
    });

    // Start the engine
    engine.start();
    engineRef.current = engine;

    // Cleanup on unmount
    return () => {
      engine.destroy();
    };
  }, [updateTimer, advanceCard]);

  // Reset timer when card changes
  useEffect(() => {
    if (engineRef.current && currentCard) {
      engineRef.current.reset();
    }
  }, [currentCard]);

  // Double-tap camouflage activation
  const handleCamoPress = () => {
    const now = Date.now();
    if (now - lastTap < 500) {
      // Double tap detected - pause timer and save session snapshot
      if (engineRef.current) {
        engineRef.current.pause();
      }
      activateCamo({
        currentFlow,
        currentIndex,
        currentCard,
        upcomingCards,
        heatPlayer,
        heatOpponent,
        flightPath,
        timerElapsed,
        isWarning,
      });
    }
    setLastTap(now);
  };

  // Timer progress (0-1 scale)
  const timerProgress = Math.min(timerElapsed / 4, 1);
  const timerColor = isWarning ? '#ff4444' : '#00aa00';

  // Flight path color (gradient from red to green)
  const getFlightColor = (value: number): string => {
    if (value < 30) return '#ff4444';
    if (value < 70) return '#ffaa00';
    return '#00aa00';
  };

  return (
    <View style={styles.container}>
      {/* Command Rail */}
      <View style={styles.commandRail}>
        {/* Timer Bead */}
        <View style={styles.timerContainer}>
          <View style={styles.timerTrack}>
            <View
              style={[
                styles.timerBead,
                {
                  left: `${timerProgress * 100}%`,
                  backgroundColor: timerColor,
                },
              ]}
            />
          </View>
          <Text style={styles.timerText}>
            {timerElapsed.toFixed(1)}s / 4.0s
          </Text>
        </View>

        {/* Flight Gauge */}
        <View style={styles.flightContainer}>
          <Text style={styles.flightLabel}>Flight Path</Text>
          <View style={styles.flightTrack}>
            <View
              style={[
                styles.flightFill,
                {
                  width: `${flightPath}%`,
                  backgroundColor: getFlightColor(flightPath),
                },
              ]}
            />
          </View>
          <Text style={styles.flightText}>{flightPath}%</Text>
        </View>

        {/* Heat Indicator */}
        <View style={styles.heatContainer}>
          <Text style={styles.heatLabel}>Heat: {heatPlayer}/10</Text>
        </View>

        {/* Camouflage Button */}
        <TouchableOpacity style={styles.camoButton} onPress={handleCamoPress}>
          <Text style={styles.camoButtonText}>🎭</Text>
        </TouchableOpacity>
      </View>

      {/* Current Card Display */}
      <View style={styles.cardDisplay}>
        {currentCard ? (
          <>
            <View style={styles.cardHeader}>
              <Text style={styles.cardClass}>{currentCard.class}</Text>
              <Text style={styles.cardElement}>
                {currentCard.element} · {currentCard.modality}
              </Text>
            </View>

            <View style={styles.cardLine}>
              <Text style={styles.cardLineLabel}>SPEAK:</Text>
              <Text style={styles.cardLineText}>{currentCard.line}</Text>
            </View>

            <View style={styles.cardCue}>
              <Text style={styles.cardCueLabel}>CUE:</Text>
              <Text style={styles.cardCueText}>{currentCard.cue}</Text>
            </View>

            <View style={styles.cardImpact}>
              <Text style={styles.cardImpactText}>
                Heat: {currentCard.heatImpact >= 0 ? '+' : ''}
                {currentCard.heatImpact} | Flight:{' '}
                {currentCard.flightDelta >= 0 ? '+' : ''}
                {currentCard.flightDelta}
              </Text>
            </View>
          </>
        ) : (
          <Text style={styles.emptyCardText}>Flow Complete</Text>
        )}
      </View>

      {/* Upcoming Cards Preview */}
      <View style={styles.upcomingSection}>
        <Text style={styles.upcomingSectionTitle}>Next Cards:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {upcomingCards.length === 0 ? (
            <Text style={styles.emptyUpcomingText}>No cards remaining</Text>
          ) : (
            upcomingCards.map((card, index) => (
              <View key={index} style={styles.upcomingCard}>
                <Text style={styles.upcomingCardClass}>{card.class}</Text>
                <Text style={styles.upcomingCardLine} numberOfLines={2}>
                  {card.line}
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      </View>

      {/* Action Button */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={[
            styles.advanceButton,
            !currentCard && styles.advanceButtonDisabled,
          ]}
          onPress={advanceCard}
          disabled={!currentCard}>
          <Text style={styles.advanceButtonText}>
            {currentCard ? 'Next Card →' : 'Flow Complete'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Camouflage Curtain Overlay */}
      <CamouflageCurtain
        onRestore={() => {
          // Resume timer when restoring from camouflage
          if (engineRef.current) {
            engineRef.current.resume();
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  commandRail: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#333333',
    gap: 12,
  },
  timerContainer: {
    gap: 4,
  },
  timerTrack: {
    height: 8,
    backgroundColor: '#333333',
    borderRadius: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  timerBead: {
    position: 'absolute',
    top: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    transform: [{translateX: -4}],
  },
  timerText: {
    fontSize: 12,
    color: '#888888',
    textAlign: 'center',
  },
  flightContainer: {
    gap: 4,
  },
  flightLabel: {
    fontSize: 12,
    color: '#cccccc',
    fontWeight: 'bold',
  },
  flightTrack: {
    height: 12,
    backgroundColor: '#333333',
    borderRadius: 6,
    overflow: 'hidden',
  },
  flightFill: {
    height: 12,
    borderRadius: 6,
  },
  flightText: {
    fontSize: 12,
    color: '#888888',
    textAlign: 'center',
  },
  heatContainer: {
    alignItems: 'center',
  },
  heatLabel: {
    fontSize: 14,
    color: '#ffaa00',
    fontWeight: 'bold',
  },
  camoButton: {
    position: 'absolute',
    top: 16,
    right: 20,
    width: 48,
    height: 48,
    backgroundColor: '#333333',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#555555',
  },
  camoButtonText: {
    fontSize: 24,
  },
  cardDisplay: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  cardHeader: {
    marginBottom: 16,
  },
  cardClass: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00aaff',
    marginBottom: 4,
  },
  cardElement: {
    fontSize: 14,
    color: '#888888',
  },
  cardLine: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#00aa00',
  },
  cardLineLabel: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  cardLineText: {
    fontSize: 18,
    color: '#ffffff',
    lineHeight: 26,
  },
  cardCue: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ffaa00',
  },
  cardCueLabel: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  cardCueText: {
    fontSize: 14,
    color: '#cccccc',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  cardImpact: {
    alignItems: 'center',
  },
  cardImpactText: {
    fontSize: 12,
    color: '#888888',
  },
  emptyCardText: {
    fontSize: 24,
    color: '#666666',
    textAlign: 'center',
  },
  upcomingSection: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  upcomingSectionTitle: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  emptyUpcomingText: {
    fontSize: 12,
    color: '#666666',
  },
  upcomingCard: {
    width: 120,
    padding: 12,
    backgroundColor: '#0a0a0a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333333',
    marginRight: 8,
  },
  upcomingCardClass: {
    fontSize: 12,
    color: '#00aaff',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  upcomingCardLine: {
    fontSize: 10,
    color: '#cccccc',
    lineHeight: 14,
  },
  actionBar: {
    padding: 20,
    backgroundColor: '#0a0a0a',
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  advanceButton: {
    backgroundColor: '#00aa00',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  advanceButtonDisabled: {
    backgroundColor: '#333333',
    opacity: 0.5,
  },
  advanceButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
