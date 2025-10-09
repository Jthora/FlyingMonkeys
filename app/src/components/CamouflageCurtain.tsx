/**
 * Camouflage Curtain: Full-screen overlay that hides gameplay in hostile situations.
 * Activated by double-tapping the camo button. Requires PIN re-entry to restore.
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';

import {useCamoStore} from '@/state/useCamoStore';
import {useVaultStore} from '@/state/useVaultStore';

interface CamouflageCurtainProps {
  onRestore: () => void;
}

export const CamouflageCurtain: React.FC<CamouflageCurtainProps> = ({
  onRestore,
}) => {
  const {isActive, deactivate} = useCamoStore();
  const {pin: storedPin} = useVaultStore();
  const [enteredPin, setEnteredPin] = useState('');
  const [error, setError] = useState('');

  if (!isActive) {
    return null;
  }

  const handleRestore = () => {
    if (enteredPin === storedPin) {
      deactivate();
      setEnteredPin('');
      setError('');
      onRestore();
    } else {
      setError('Incorrect PIN');
      setEnteredPin('');
    }
  };

  return (
    <Modal visible={isActive} animationType="fade" transparent={false}>
      <View style={styles.container}>
        {/* Neutral Interface - looks like a note-taking app */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Notes</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.noteCard}>
            <Text style={styles.noteTitle}>Meeting Notes - Q4 Planning</Text>
            <Text style={styles.noteBody}>
              {
                '- Review budget allocations\n- Discuss team objectives\n- Schedule follow-up meetings\n- Action items for next quarter'
              }
            </Text>
          </View>

          <View style={styles.noteCard}>
            <Text style={styles.noteTitle}>Project Ideas</Text>
            <Text style={styles.noteBody}>
              {
                '- Research new frameworks\n- Evaluate tools and libraries\n- Prototype concepts\n- Document findings'
              }
            </Text>
          </View>
        </View>

        {/* Hidden restore interface */}
        <View style={styles.restorePanel}>
          <Text style={styles.restoreLabel}>Enter PIN to restore:</Text>
          <TextInput
            style={styles.pinInput}
            value={enteredPin}
            onChangeText={setEnteredPin}
            keyboardType="number-pad"
            secureTextEntry
            maxLength={6}
            placeholder="Enter PIN"
            placeholderTextColor="#888888"
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <TouchableOpacity
            style={styles.restoreButton}
            onPress={handleRestore}>
            <Text style={styles.restoreButtonText}>Restore Session</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  content: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  noteCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  noteBody: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  restorePanel: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 12,
  },
  restoreLabel: {
    fontSize: 14,
    color: '#666666',
  },
  pinInput: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333333',
  },
  errorText: {
    fontSize: 14,
    color: '#ff4444',
  },
  restoreButton: {
    backgroundColor: '#007aff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  restoreButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
