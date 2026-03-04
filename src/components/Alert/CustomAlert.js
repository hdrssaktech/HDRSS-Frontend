import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Animated,
} from "react-native";

const CustomAlert = ({
  visible,
  type = "success", // "success" or "error"
  title,
  message,
  onConfirm,
  autoClose = false,
  duration = 2000,
}) => {
  const scaleValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleValue, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();

      if (autoClose) {
        const timer = setTimeout(() => {
          handleClose();
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      scaleValue.setValue(0);
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(scaleValue, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      onConfirm && onConfirm();
    });
  };

  const isSuccess = type === "success";

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.alertBox,
            { transform: [{ scale: scaleValue }] },
          ]}
        >
          <View style={[styles.header, isSuccess ? styles.successHeader : styles.errorHeader]}>
            <Text style={styles.title}>{title}</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.message}>{message}</Text>
          </View>

          {!autoClose && (
            <TouchableOpacity
              style={[styles.button, isSuccess ? styles.successButton : styles.errorButton]}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

export default CustomAlert;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  alertBox: {
    width: "85%",
    maxWidth: 320,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 8,
  },

  header: {
    padding: 18,
    alignItems: "center",
  },

  // BRAND HEADER
  successHeader: {
    backgroundColor: "#a32311",
  },

  errorHeader: {
    backgroundColor: "#7f1a0d",
  },

  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  content: {
    padding: 22,
    alignItems: "center",
  },

  message: {
    fontSize: 15,
    color: "#444",
    textAlign: "center",
    lineHeight: 22,
  },

  button: {
    margin: 16,
    marginTop: 0,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  successButton: {
    backgroundColor: "#a32311",
  },

  errorButton: {
    backgroundColor: "#7f1a0d",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});