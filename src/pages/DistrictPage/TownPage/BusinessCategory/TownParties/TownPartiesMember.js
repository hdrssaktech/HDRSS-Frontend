import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Linking,
  Platform,
  Alert,
  useWindowDimensions,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Loader from "../../../../../components/Alert/Loader";

export default function TownPartiesMember({ route }) {

  const { townId} = route.params;
  const navigation = useNavigation();

  const { width, height } = useWindowDimensions();
  const isTablet = width >= 600;

  const imageSize = isTablet ? 140 : 100;

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      const res = await axios.get(
        `https://hdrss-backend.onrender.com/api/town-parties/${townId}`
      );

      // const filtered = res.data.data.filter(
      //   (item) => item.parties === partyName
      // );

      setMembers(res.data.data);

    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleCall = (phoneNumber) => {
    if (phoneNumber) Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleLocationPress = (location) => {
    if (!location) return;

    const encodedLocation = encodeURIComponent(location);
    Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`
    );
  };

  const renderItem = ({ item }) => (

    <TouchableOpacity
      style={[styles.card, isTablet && styles.cardTablet]}
      activeOpacity={0.85}
      onPress={() =>
        navigation.navigate("TownPartiesMemberDetails", {
          member: item,
        })
      }
    >

      {/* IMAGE */}
      <View style={[styles.imageContainer, { width: imageSize, height: imageSize }]}>
        <Image
          source={{
            uri: item.image || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* CONTENT */}
      <View style={[styles.contentContainer, isTablet && styles.contentContainerTablet]}>

        <View style={styles.textSection}>

          <Text style={[styles.name, isTablet && styles.nameTablet]} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={[styles.parties, isTablet && styles.partiesTablet]} numberOfLines={1}>
            {item.parties}
          </Text>

          <Text style={[styles.role, isTablet && styles.roleTablet]} numberOfLines={1}>
            {item.role}
          </Text>

          <Text style={styles.wardText}>
            Ward No : {item.orderNo}
          </Text>

        </View>

        <View style={[styles.buttonsRow, isTablet && styles.buttonsRowTablet]}>

          {item.phoneNumber && (
            <TouchableOpacity
              style={[styles.callButton, isTablet && styles.callButtonTablet]}
              onPress={(e) => {
                e.stopPropagation();
                handleCall(item.phoneNumber);
              }}
            >
              <Ionicons name="call" size={isTablet ? 18 : 16} color="#fff" />
              <Text style={styles.buttonText}>Call</Text>
            </TouchableOpacity>
          )}

          {item.location && (
            <TouchableOpacity
              style={[styles.directionsButton, isTablet && styles.directionsButtonTablet]}
              onPress={(e) => {
                e.stopPropagation();
                handleLocationPress(item.location);
              }}
            >
              <Ionicons name="navigate" size={isTablet ? 18 : 16} color="#8B0000" />
              <Text style={styles.directionsButtonText}>Directions</Text>
            </TouchableOpacity>
          )}

        </View>

      </View>

    </TouchableOpacity>

  );

  if (loading) {
    return <Loader />;
  }

  return (

    <SafeAreaView style={styles.safe}>

      <StatusBar backgroundColor="#8B0000" barStyle="light-content" />

      {/* HEADER */}

      <View style={styles.header}>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>
            Town Councilor
          </Text>
        </View>

        <View style={{ width: 40 }} />

      </View>

      <FlatList
        data={members}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
      />

    </SafeAreaView>

  );

}

const styles = StyleSheet.create({

  safe: {
    flex: 1,
    // backgroundColor: "#8B0000"
  },

  header: {
    backgroundColor: "#8B0000",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 10 : 40,
    paddingBottom: 12,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitleWrap: {
    flex: 1,
    alignItems: "center",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    flexDirection: "row",
    padding: 12,
    marginBottom: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(139,0,0,0.1)"
  },

  imageContainer: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
    marginRight: 12
  },

  image: {
    width: "100%",
    height: "100%"
  },

  contentContainer: {
    flex: 1,
    justifyContent: "space-between"
  },

  textSection: {
    marginBottom: 8
  },

  name: {
    fontSize: 16,
    fontWeight: "800",
    color: "#8B0000",
    marginBottom: 4
  },

  role: {
    fontSize: 13,
    color: "#666"
  },
  parties:{
    fontSize: 15,
    color: "#990f0f"
  },

  wardText: {
    fontSize: 12,
    color: "#888"
  },

  buttonsRow: {
    flexDirection: "row",
    gap: 8
  },

  callButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#8B0000",
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    gap: 6
  },

  directionsButton: {
    flex: 1,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#8B0000",
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    gap: 6
  },

  buttonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700"
  },

  directionsButtonText: {
    color: "#8B0000",
    fontSize: 13,
    fontWeight: "700"
  }

});