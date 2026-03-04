import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Image, 
  TouchableOpacity,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function TownPartiesCategory() {
  const route = useRoute();
  const { townId } = route.params;
  const navigation = useNavigation();

  // 🔹 Static Party Data with Images
  const parties = [
    { id: 1, name: 'BJP', image: require('../../../../../../assets/Parties/bjp.webp') },
    { id: 2, name: 'ADMK', image: require('../../../../../../assets/Parties/admk.jpg') },
    { id: 3, name: 'DMK', image: require('../../../../../../assets/Parties/dmk.png') },
    { id: 4, name: 'TVK', image: require('../../../../../../assets/Parties/tvk.jpg') },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate('TownPartiesMember', {
          partyName: item.name,
          townId: townId,
        })
      }
    >
      <Image source={item.image} style={styles.image} resizeMode="contain" />
      <Text style={styles.partyName}>{item.name}</Text>
      <View style={styles.arrowContainer}>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#93210A" barStyle="light-content" />
      
      {/* Simple Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" style={styles.header_arrow} size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Party</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Clean Grid */}
      <FlatList
        data={parties}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#93210A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    elevation: 3,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  header_arrow :{
    paddingTop:40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 40,
    color: '#fff',
  },
  container: {
    padding: 16,
    paddingBottom: 24,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 8,
    borderRadius: 12,
    alignItems: 'center',
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  image: {
    width: 70,
    height: 70,
    marginBottom: 12,
  },
  partyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#bd0707ff',
    marginBottom: 8,
  },
});