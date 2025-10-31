import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';   // ✅ navigation hook
const DATA = [
  {
    id: '1',
    name: 'Swami Vivekananda',
    birth: '12 January 1863',
    death: '4 July 1902',
    image: require('../../../../assets/Leader/swami.jpg'),       // ✅ corrected path
  },
  {
    id: '2',
    name: 'S. R. Ranganathan',
    birth: '1892',
    death: '1972',
    image: require('../../../../assets/Leader/ranganathan.jpg'), // ✅
  },
  {
    id: '3',
    name: 'K. K. Mathew',
    birth: '1911',
    death: '1992',
    image: require('../../../../assets/Leader/mathew.jpg'),      // ✅
  },
  {
    id: '4',
    name: 'Marshal Nesamony',
    birth: '1895',
    death: '1968',
    image: require('../../../../assets/Leader/nesamony.jpg'),    // ✅
  },
];

export default function LeaderPage2() {
  const navigation = useNavigation();   // ✅ get navigation

  const renderItem = ({ item }) => (
    <TouchableOpacity
  style={styles.card}
  onPress={() => navigation.navigate('LeaderPage3', item)}
>
  <Image source={item.image} style={styles.avatar} />

  <View style={styles.infoContainer}>
    <Text style={styles.name}>{item.name}</Text>
    <Text style={styles.detail}>Birth : {item.birth}</Text>
    <Text style={styles.detail}>Death : {item.death}</Text>
  </View>

  <Ionicons name="chevron-forward" size={20} color="#B22222" />
</TouchableOpacity>

  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity   onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>

        <Text style={styles.headerText}>Kanyakumari</Text>
      </View>

      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginTop: 32,
    backgroundColor: '#93210A',
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 15,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 19,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    top:30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    resizeMode: 'cover',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B0000',
    marginBottom: 4,
  },
  detail: {
    fontSize: 14,
    color: '#444',
    marginBottom: 2,
  },
});

