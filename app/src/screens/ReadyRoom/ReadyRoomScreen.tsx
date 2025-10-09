import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import type {RootStackParamList} from '@/navigation/AppNavigator';
import {useVaultStore} from '@/state/useVaultStore';
import {useSessionStore} from '@/state/useSessionStore';
import type {Flow} from '@/vault/types';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ReadyRoom'
>;

export const ReadyRoomScreen = (): React.JSX.Element => {
  const navigation = useNavigation<NavigationProp>();
  const {flows, cards, lock} = useVaultStore();
  const {startSession} = useSessionStore();
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null);

  const selectedFlow = flows.find(f => f.id === selectedFlowId);

  const handleLockVault = () => {
    Alert.alert('Lock Vault', 'Lock the vault and return to authentication?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Lock',
        style: 'destructive',
        onPress: () => {
          lock();
          navigation.replace('LockGate');
        },
      },
    ]);
  };

  // Check if player has all required counter cards for selected flow
  const getMissingCounters = (flow: Flow): string[] => {
    const cardIds = new Set(cards.map(c => c.id));
    return flow.requiredCounters.filter(counterId => !cardIds.has(counterId));
  };

  const handleLaunch = () => {
    if (!selectedFlow) {
      Alert.alert('No Flow Selected', 'Please select a flow to launch.');
      return;
    }

    const missingCounters = getMissingCounters(selectedFlow);
    if (missingCounters.length > 0) {
      Alert.alert(
        'Missing Counters',
        `You are missing ${missingCounters.length} required counter(s). Launch anyway?`,
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Launch Anyway',
            onPress: () => {
              startSession(selectedFlow, cards);
              navigation.replace('LiveStack');
            },
          },
        ],
      );
      return;
    }

    // All counters present, launch immediately
    startSession(selectedFlow, cards);
    navigation.replace('LiveStack');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.lockButton} onPress={handleLockVault}>
          <Text style={styles.lockButtonText}>🔒 Lock</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Ready Room</Text>
        <Text style={styles.subtitle}>
          Stage your deckpacks and calibrate the cadence.
        </Text>
      </View>

      {/* Flow Selector List */}
      <ScrollView
        style={styles.flowList}
        contentContainerStyle={styles.flowListContent}>
        {flows.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No flows available.</Text>
            <Text style={styles.emptyStateSubtext}>
              Add flows in the vault to get started.
            </Text>
          </View>
        ) : (
          flows.map(flow => {
            const isSelected = flow.id === selectedFlowId;
            const missingCounters = getMissingCounters(flow);
            const hasMissing = missingCounters.length > 0;

            return (
              <TouchableOpacity
                key={flow.id}
                style={[
                  styles.flowCard,
                  isSelected && styles.flowCardSelected,
                  hasMissing && styles.flowCardWarning,
                ]}
                onPress={() => setSelectedFlowId(flow.id)}>
                <View style={styles.flowCardHeader}>
                  <Text style={styles.flowCardTitle}>{flow.title}</Text>
                  {hasMissing && (
                    <View style={styles.warningBadge}>
                      <Text style={styles.warningBadgeText}>
                        {missingCounters.length} missing
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={styles.flowCardTrigger}>
                  Trigger: "{flow.trigger}"
                </Text>
                <Text style={styles.flowCardMeta}>
                  {flow.sequence.length} cards · {flow.requiredCounters.length}{' '}
                  counters
                </Text>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* Action Bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={() => navigation.navigate('Vault')}>
          <Text style={styles.buttonText}>Vault</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            styles.buttonPrimary,
            !selectedFlow && styles.buttonDisabled,
          ]}
          onPress={handleLaunch}
          disabled={!selectedFlow}>
          <Text style={[styles.buttonText, styles.buttonTextPrimary]}>
            Launch
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
  },
  lockButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#333333',
    borderRadius: 6,
  },
  lockButtonText: {
    fontSize: 14,
    color: '#ffaa00',
    fontWeight: 'bold',
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
  },
  flowList: {
    flex: 1,
  },
  flowListContent: {
    padding: 20,
    gap: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#555555',
  },
  flowCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#333333',
  },
  flowCardSelected: {
    borderColor: '#00aa00',
    backgroundColor: '#1a2a1a',
  },
  flowCardWarning: {
    borderColor: '#aa6600',
  },
  flowCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  flowCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  warningBadge: {
    backgroundColor: '#aa6600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  warningBadgeText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  flowCardTrigger: {
    fontSize: 14,
    color: '#cccccc',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  flowCardMeta: {
    fontSize: 12,
    color: '#888888',
  },
  actionBar: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#222222',
    backgroundColor: '#0a0a0a',
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#333333',
    borderWidth: 1,
    borderColor: '#555555',
  },
  buttonPrimary: {
    backgroundColor: '#00aa00',
  },
  buttonDisabled: {
    backgroundColor: '#333333',
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  buttonTextPrimary: {
    color: '#ffffff',
  },
});
