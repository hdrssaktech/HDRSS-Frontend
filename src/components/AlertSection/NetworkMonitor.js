import React, { useEffect, useRef } from 'react';
import { View, Text, Modal, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const NetworkMonitor = ({ children }) => {
  const [isConnected, setIsConnected] = React.useState(true);
  const [showOfflineModal, setShowOfflineModal] = React.useState(false);
  const alertShownRef = useRef(false);

  useEffect(() => {
    let alertTimeout;

    const unsubscribe = NetInfo.addEventListener(state => {
      const connected = state.isConnected && state.isInternetReachable;
      
      // Connection lost
      if (!connected && isConnected && !alertShownRef.current) {
        alertShownRef.current = true;
        setShowOfflineModal(true);
        
        // Show Alert every time connection is lost
        Alert.alert(
          "Network Error",
          "Please check your internet connection",
          [
            { 
              text: "OK", 
              onPress: () => {
                alertShownRef.current = false;
                setShowOfflineModal(false);
              } 
            }
          ],
          { cancelable: false }
        );
      }
      
      // Connection restored
      if (connected && !isConnected) {
        alertShownRef.current = false;
        setShowOfflineModal(false);
        
        // Optional: Show reconnected message
        Alert.alert(
          "Connected",
          "Your internet connection is back",
          [{ text: "OK" }]
        );
      }
      
      setIsConnected(connected ?? false);
    });

    return () => unsubscribe();
  }, [isConnected]);

  return (
    <>
      {children}
      
      {/* Optional: Full screen overlay when offline */}
      <Modal
        visible={showOfflineModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#FF3B30" />
            <Text style={styles.modalText}>No Internet Connection</Text>
            <Text style={styles.modalSubText}>
              Please check your network settings
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    color: '#333',
  },
  modalSubText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
});

export default NetworkMonitor;