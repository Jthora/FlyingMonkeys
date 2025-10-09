import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import type {RootStackParamList} from '@/navigation/AppNavigator';
import {useVaultStore} from '@/state/useVaultStore';
import {attemptUnlock, checkLockoutStatus} from '@/vault/unlockHelper';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'LockGate'>;

export const LockGateScreen = (): React.JSX.Element => {
  const navigation = useNavigation<NavigationProp>();
  const {unlock, isUnlocked} = useVaultStore();
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lockoutInfo, setLockoutInfo] = useState<{
    remainingMs: number;
  } | null>(null);

  // Check for lockout on mount
  useEffect(() => {
    const checkLockout = async () => {
      const remaining = await checkLockoutStatus();
      if (remaining !== null && remaining > 0) {
        setLockoutInfo({remainingMs: remaining});
      }
    };
    checkLockout();
  }, []);

  // Update lockout timer every second
  useEffect(() => {
    if (!lockoutInfo) return;
    const interval = setInterval(() => {
      setLockoutInfo(prev => {
        if (!prev) return null;
        const newRemaining = prev.remainingMs - 1000;
        if (newRemaining <= 0) {
          return null;
        }
        return {remainingMs: newRemaining};
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutInfo]);

  // Navigate to ReadyRoom when unlocked
  useEffect(() => {
    if (isUnlocked) {
      navigation.replace('ReadyRoom');
    }
  }, [isUnlocked, navigation]);

  const handlePinPress = (digit: string) => {
    if (lockoutInfo) return;
    if (pin.length < 6) {
      setPin(prev => prev + digit);
    }
  };

  const handleBackspace = () => {
    if (lockoutInfo) return;
    setPin(prev => prev.slice(0, -1));
  };

  const handleUnlock = async () => {
    if (pin.length === 0 || lockoutInfo) return;
    setIsLoading(true);

    try {
      const result = await attemptUnlock(pin);

      if (result.status === 'success') {
        // Build VaultData structure for store
        const vaultData = {
          cards: result.cards,
          flows: result.flows,
          salt: '',
          version: 1,
          lastModified: new Date().toISOString(),
        };
        unlock(pin, vaultData);
        // Navigation happens in useEffect above
      } else if (result.status === 'wrong-pin') {
        Alert.alert(
          'Wrong PIN',
          `Incorrect PIN. ${result.attemptsRemaining} attempts remaining.`,
        );
        setPin('');
      } else if (result.status === 'locked-out') {
        setLockoutInfo({remainingMs: result.remainingLockoutMs});
        setPin('');
        Alert.alert(
          'Locked Out',
          `Too many failed attempts. Wait ${Math.ceil(
            result.remainingLockoutMs / 60000,
          )} minutes.`,
        );
      } else if (result.status === 'no-vault') {
        Alert.alert(
          'No Vault Found',
          'No vault exists. Create one by entering a new PIN.',
        );
        setPin('');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to unlock vault. Please try again.');
      setPin('');
    } finally {
      setIsLoading(false);
    }
  };

  const formatLockoutTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lock Gate</Text>
        <Text style={styles.subtitle}>
          Authenticate and wake the vault shell.
        </Text>
      </View>

      {/* PIN Display */}
      <View style={styles.pinDisplay}>
        {lockoutInfo ? (
          <Text style={styles.lockoutText}>
            Locked Out: {formatLockoutTime(lockoutInfo.remainingMs)}
          </Text>
        ) : (
          <Text style={styles.pinDots}>
            {Array.from({length: 6}, (_, i) =>
              i < pin.length ? '●' : '○',
            ).join(' ')}
          </Text>
        )}
      </View>

      {/* Keypad */}
      <View style={styles.keypad}>
        {[
          ['1', '2', '3'],
          ['4', '5', '6'],
          ['7', '8', '9'],
          ['←', '0', '✓'],
        ].map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keypadRow}>
            {row.map(key => {
              const isBackspace = key === '←';
              const isEnter = key === '✓';
              const disabled = lockoutInfo !== null;

              return (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.keypadButton,
                    isEnter && styles.keypadButtonEnter,
                    disabled && styles.keypadButtonDisabled,
                  ]}
                  onPress={() => {
                    if (isBackspace) {
                      handleBackspace();
                    } else if (isEnter) {
                      handleUnlock();
                    } else {
                      handlePinPress(key);
                    }
                  }}
                  disabled={disabled || isLoading}>
                  <Text
                    style={[
                      styles.keypadButtonText,
                      isEnter && styles.keypadButtonTextEnter,
                    ]}>
                    {key}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      {/* Status Text */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {isLoading
            ? 'Unlocking...'
            : lockoutInfo
            ? 'Too many failed attempts'
            : 'Enter your PIN'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    padding: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
  },
  pinDisplay: {
    marginBottom: 60,
    alignItems: 'center',
  },
  pinDots: {
    fontSize: 32,
    color: '#ffffff',
    letterSpacing: 8,
  },
  lockoutText: {
    fontSize: 18,
    color: '#ff4444',
    fontWeight: 'bold',
  },
  keypad: {
    gap: 16,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  keypadButton: {
    width: 80,
    height: 80,
    backgroundColor: '#1a1a1a',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  keypadButtonEnter: {
    backgroundColor: '#00aa00',
    borderColor: '#00cc00',
  },
  keypadButtonDisabled: {
    opacity: 0.3,
  },
  keypadButtonText: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: '500',
  },
  keypadButtonTextEnter: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666666',
  },
});
