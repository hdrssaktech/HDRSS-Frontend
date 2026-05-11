import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity,
  TextInput, StyleSheet, Alert, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // ✅ ADD THIS
import { addEventToCalendar } from './calendarService';

const PRESETS = [
  { label: '30 min', value: 30 },
  { label: '1 hour', value: 60 },
  { label: '1 day', value: 1440 },
  { label: '4 days', value: 5760 },
  { label: '1 week', value: 10080 },
];

// ✅ Unique storage key per event
const getReminderKey = (event) => `reminder_${event?.id || event?.title}`;

export default function ReminderPicker({ event }) {
  const [selected, setSelected] = useState(null);
  const [customDays, setCustomDays] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSetLabel, setLastSetLabel] = useState(null);

  // ✅ Load saved reminder when component mounts
  useEffect(() => {
    const loadSavedReminder = async () => {
      try {
        const saved = await AsyncStorage.getItem(getReminderKey(event));
        if (saved) {
          setLastSetLabel(saved);
        }
      } catch (e) {
        console.warn('Failed to load reminder:', e);
      }
    };
    if (event) loadSavedReminder();
  }, [event]);

  const handleAddReminder = async () => {
    if (isSubmitting || loading) return;

    const eventDate = new Date(event.date);
    if (eventDate < new Date()) {
      Alert.alert('Event Passed', 'This event has already occurred.');
      return;
    }

    let minutes = selected;
    let label = PRESETS.find(p => p.value === selected)?.label;

    if (customDays) {
      const days = parseInt(customDays);
      if (isNaN(days) || days <= 0) {
        Alert.alert('Invalid', 'Please enter a valid number of days.');
        return;
      }
      minutes = days * 24 * 60;
      label = `${days} day${days > 1 ? 's' : ''} before`;
    }

    if (!minutes) {
      Alert.alert('Select Reminder', 'Please pick or enter a reminder time.');
      return;
    }

    setIsSubmitting(true);
    setLoading(true);

    const eventId = await addEventToCalendar(event, minutes);

    setLoading(false);
    setIsSubmitting(false);

    if (eventId) {
      // ✅ Save to AsyncStorage so it survives refresh
      try {
        await AsyncStorage.setItem(getReminderKey(event), label);
      } catch (e) {
        console.warn('Failed to save reminder:', e);
      }

      setLastSetLabel(label);
      setSelected(null);
      setCustomDays('');
      Alert.alert('✅ Done!', `Reminder set for ${label}.`);
    } else {
      Alert.alert('Failed', 'Could not add reminder. Try again.');
    }
  };

  // ✅ Optional: clear reminder
  const handleClearReminder = async () => {
    try {
      await AsyncStorage.removeItem(getReminderKey(event));
      setLastSetLabel(null);
    } catch (e) {
      console.warn('Failed to clear reminder:', e);
    }
  };

  return (
    <View style={styles.container}>

      {/* Title Row */}
      <View style={styles.titleRow}>
        <Ionicons name="notifications-outline" size={20} color="#93210A" />
        <Text style={styles.title}>Set Reminder</Text>
      </View>

      {/* ✅ Show persisted reminder */}
      {lastSetLabel && (
        <View style={styles.currentReminder}>
          <Ionicons name="checkmark-circle" size={18} color="#2e7d32" />
          <Text style={styles.currentReminderText}>
            Set: <Text style={styles.currentReminderBold}>{lastSetLabel}</Text>
          </Text>
          {/* ✅ Clear button */}
          <TouchableOpacity onPress={handleClearReminder}>
            <Ionicons name="close-circle-outline" size={18} color="#888" />
          </TouchableOpacity>
        </View>
      )}

      {/* Preset Chips */}
      <View style={styles.presets}>
        {PRESETS.map((p) => (
          <TouchableOpacity
            key={p.value}
            style={[styles.chip, selected === p.value && styles.chipSelected]}
            onPress={() => { setSelected(p.value); setCustomDays(''); }}
          >
            <Text style={[styles.chipText, selected === p.value && styles.chipTextSelected]}>
              {p.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Custom Input */}
      <TextInput
        style={styles.input}
        placeholder="Custom days (e.g. 3)"
        keyboardType="numeric"
        value={customDays}
        onChangeText={(val) => { setCustomDays(val); setSelected(null); }}
      />

      <TouchableOpacity
        style={[styles.button, (loading || isSubmitting) && styles.buttonDisabled]}
        onPress={handleAddReminder}
        disabled={loading || isSubmitting}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : (
            <View style={styles.buttonRow}>
              <Ionicons name="calendar-outline" size={18} color="#fff" />
              <Text style={styles.buttonText}>
                {lastSetLabel ? '  Update Reminder' : '  Add to Calendar'}
              </Text>
            </View>
          )
        }
      </TouchableOpacity>

    </View>
  );
}

// styles remain the same...

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff8f0',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    borderWidth: 1,
    borderColor: '#ffd391',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  title: { fontSize: 16, fontWeight: 'bold', color: '#93210A' },

  // ✅ Current reminder banner
  currentReminder: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fff4',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#a5d6a7',
    gap: 6,
    flexWrap: 'wrap',
  },
  currentReminderText: { fontSize: 13, color: '#2e7d32', flex: 1 },
  currentReminderBold: { fontWeight: 'bold' },
  changeHint: { fontSize: 11, color: '#888' },

  presets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1,
    borderColor: '#ffd391', backgroundColor: '#fff5e1',
  },
  chipSelected: { backgroundColor: '#93210A', borderColor: '#93210A' },
  chipText: { fontSize: 13, color: '#555' },
  chipTextSelected: { color: '#fff', fontWeight: 'bold' },
  input: {
    borderWidth: 1, borderColor: '#ffd391', borderRadius: 8,
    padding: 10, fontSize: 14, marginBottom: 12, backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#93210A', padding: 14,
    borderRadius: 10, alignItems: 'center',
  },
  buttonDisabled: { backgroundColor: '#c87a6a', opacity: 0.6 },
  buttonRow: { flexDirection: 'row', alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
