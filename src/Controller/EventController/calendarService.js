import * as Calendar from 'expo-calendar';
import { Alert, Linking, Platform } from 'react-native';

export const requestCalendarPermission = async () => {
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert(
      'Permission Needed',
      'Please allow calendar access to set reminders.',
      [
        { text: 'Cancel' },
        { text: 'Open Settings', onPress: () => Linking.openSettings() }
      ]
    );
    return false;
  }
  return true;
};

const getDefaultCalendarId = async () => {
  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  if (Platform.OS === 'ios') {
    const defaultCal = await Calendar.getDefaultCalendarAsync();
    return defaultCal.id;
  }
  const primary = calendars.find(c => c.isPrimary) || calendars[0];
  return primary.id;
};

export const addEventToCalendar = async (event, minutesBefore) => {
  const hasPermission = await requestCalendarPermission();
  if (!hasPermission) return null;

  try {
    const calendarId = await getDefaultCalendarId();

    const startDate = new Date(event.date);
    startDate.setHours(9, 0, 0, 0);

    const endDate = new Date(event.date);
    endDate.setHours(10, 0, 0, 0);

    const eventId = await Calendar.createEventAsync(calendarId, {
      title: event.name,
      startDate,
      endDate,
      location: event.location || '',
      notes: event.description || '',
      alarms: [{ relativeOffset: -minutesBefore }],
    });

    return eventId;
  } catch (err) {
    console.error('Calendar error:', err);
    return null;
  }
};