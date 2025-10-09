import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import type {RootStackParamList} from '@/navigation/AppNavigator';
import {useVaultStore} from '@/state/useVaultStore';
import {saveVault} from '@/vault/vaultDriver';
import type {Card} from '@/vault/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Vault'>;

export const VaultScreen = (): React.JSX.Element => {
  const navigation = useNavigation<NavigationProp>();
  const {cards, flows, updateCards, pin, salt, lastModified} = useVaultStore();
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editedLine, setEditedLine] = useState('');
  const [editedCue, setEditedCue] = useState('');

  const handleEditCard = (card: Card) => {
    setEditingCardId(card.id);
    setEditedLine(card.line);
    setEditedCue(card.cue);
  };

  const handleSaveCard = async () => {
    if (!editingCardId) return;

    const updatedCards = cards.map(card => {
      if (card.id === editingCardId) {
        return {
          ...card,
          line: editedLine,
          cue: editedCue,
        };
      }
      return card;
    });

    // Update store
    updateCards(updatedCards);

    // Save to disk
    if (pin && salt) {
      try {
        await saveVault(
          {
            cards: updatedCards,
            flows,
            salt,
            version: 1,
            lastModified: lastModified || new Date().toISOString(),
          },
          pin,
        );
        Alert.alert('Saved', 'Card updated successfully');
      } catch (error) {
        Alert.alert('Error', 'Failed to save vault');
      }
    }

    // Clear edit state
    setEditingCardId(null);
    setEditedLine('');
    setEditedCue('');
  };

  const handleCancelEdit = () => {
    setEditingCardId(null);
    setEditedLine('');
    setEditedCue('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Vault</Text>
        <Text style={styles.subtitle}>
          Manage encrypted packs, backups, and duress protocols.
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}>
        {/* Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{cards.length}</Text>
            <Text style={styles.statLabel}>Cards</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{flows.length}</Text>
            <Text style={styles.statLabel}>Flows</Text>
          </View>
        </View>

        {/* Cards List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Cards</Text>
          {cards.map(card => {
            const isEditing = editingCardId === card.id;

            return (
              <View key={card.id} style={styles.cardItem}>
                <View style={styles.cardItemHeader}>
                  <Text style={styles.cardItemClass}>{card.class}</Text>
                  <Text style={styles.cardItemElement}>
                    {card.element} · {card.modality}
                  </Text>
                </View>

                {isEditing ? (
                  <>
                    <View style={styles.editField}>
                      <Text style={styles.editFieldLabel}>Line:</Text>
                      <TextInput
                        style={styles.editFieldInput}
                        value={editedLine}
                        onChangeText={setEditedLine}
                        multiline
                        placeholder="Enter card line"
                        placeholderTextColor="#666666"
                      />
                    </View>

                    <View style={styles.editField}>
                      <Text style={styles.editFieldLabel}>Cue:</Text>
                      <TextInput
                        style={styles.editFieldInput}
                        value={editedCue}
                        onChangeText={setEditedCue}
                        multiline
                        placeholder="Enter card cue"
                        placeholderTextColor="#666666"
                      />
                    </View>

                    <View style={styles.editActions}>
                      <TouchableOpacity
                        style={[
                          styles.editActionButton,
                          styles.editActionButtonCancel,
                        ]}
                        onPress={handleCancelEdit}>
                        <Text style={styles.editActionButtonText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.editActionButton,
                          styles.editActionButtonSave,
                        ]}
                        onPress={handleSaveCard}>
                        <Text style={styles.editActionButtonText}>Save</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <>
                    <Text style={styles.cardItemLine}>{card.line}</Text>
                    <Text style={styles.cardItemCue}>{card.cue}</Text>
                    <View style={styles.cardItemMeta}>
                      <Text style={styles.cardItemMetaText}>
                        Heat: {card.heatImpact >= 0 ? '+' : ''}
                        {card.heatImpact} | Flight:{' '}
                        {card.flightDelta >= 0 ? '+' : ''}
                        {card.flightDelta}
                      </Text>
                      <TouchableOpacity onPress={() => handleEditCard(card)}>
                        <Text style={styles.editButton}>Edit</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            );
          })}
        </View>

        {/* Flows List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Flows</Text>
          {flows.map(flow => (
            <View key={flow.id} style={styles.flowItem}>
              <Text style={styles.flowItemTitle}>{flow.title}</Text>
              <Text style={styles.flowItemTrigger}>
                Trigger: "{flow.trigger}"
              </Text>
              <Text style={styles.flowItemMeta}>
                {flow.sequence.length} cards · {flow.requiredCounters.length}{' '}
                counters
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
  },
  backButton: {
    marginBottom: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#00aaff',
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    gap: 24,
  },
  statsSection: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00aaff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#888888',
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  cardItem: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
    gap: 8,
  },
  cardItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardItemClass: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00aaff',
  },
  cardItemElement: {
    fontSize: 12,
    color: '#888888',
  },
  cardItemLine: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 22,
  },
  cardItemCue: {
    fontSize: 14,
    color: '#cccccc',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  cardItemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  cardItemMetaText: {
    fontSize: 12,
    color: '#888888',
  },
  editButton: {
    fontSize: 14,
    color: '#00aaff',
    fontWeight: 'bold',
  },
  editField: {
    gap: 4,
  },
  editFieldLabel: {
    fontSize: 12,
    color: '#888888',
    fontWeight: 'bold',
  },
  editFieldInput: {
    backgroundColor: '#0a0a0a',
    borderWidth: 1,
    borderColor: '#444444',
    borderRadius: 4,
    padding: 12,
    fontSize: 14,
    color: '#ffffff',
    minHeight: 60,
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  editActionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  editActionButtonCancel: {
    backgroundColor: '#333333',
  },
  editActionButtonSave: {
    backgroundColor: '#00aa00',
  },
  editActionButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  flowItem: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
    gap: 4,
  },
  flowItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  flowItemTrigger: {
    fontSize: 14,
    color: '#cccccc',
    fontStyle: 'italic',
  },
  flowItemMeta: {
    fontSize: 12,
    color: '#888888',
  },
});
