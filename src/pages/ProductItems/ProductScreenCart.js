// screens/CartScreen.js  (route name: ProductScreenCart)
import React, { useState } from "react";
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Image, StatusBar, Platform, Alert, SafeAreaView, Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useCart } from "../../context/CartContext";
// ✅ Import HeaderCartOrders from the correct path
import HeaderCartOrders from "./ProductScreenHeaderCartOrders";

const { width } = Dimensions.get("window");
const isTablet = width > 600;

const C = {
  primary: "#9D1B00",
  primaryDark: "#9D1B00",
  bg: "#F7F3F0",
  surface: "#FFFFFF",
  textDark: "#1A0A0A",
  textMid: "#5C3A3A",
  textLight: "#9E7070",
  border: "#EDE0DC",
};

export default function CartScreen({ navigation }) {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();

  const totalItems = cartItems.reduce((s, i) => s + i.quantity, 0);

  const handleRemove = (itemId) => {
    Alert.alert("Remove Item", "Remove this item from cart?", [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => removeFromCart(itemId) },
    ]);
  };

  const handleClear = () => {
    if (!cartItems.length) return;
    Alert.alert("Clear Cart", "Remove all items?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear All", style: "destructive", onPress: clearCart },
    ]);
  };

  const proceedToCheckout = () => {
    if (!cartItems.length) {
      Alert.alert("Empty Cart", "Please add items before checkout.");
      return;
    }
    navigation.navigate("ProductScreenCheckout", { items: cartItems, totalAmount: cartTotal });
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image || "https://via.placeholder.com/90" }} style={styles.itemImg} resizeMode="cover" />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={2}>{item.productName || "Product"}</Text>
        <Text style={styles.itemPrice}>₹{parseFloat(item.price || 0).toFixed(2)}</Text>

        <View style={styles.qtyRow}>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.id, item.quantity - 1)}>
            <Ionicons name="remove" size={16} color={C.primary} />
          </TouchableOpacity>
          <Text style={styles.qtyNum}>{item.quantity}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.id, item.quantity + 1)}>
            <Ionicons name="add" size={16} color={C.primary} />
          </TouchableOpacity>

          <Text style={styles.itemSubtotal}>₹{(parseFloat(item.price || 0) * item.quantity).toFixed(2)}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.trashBtn} onPress={() => handleRemove(item.id)}>
        <Ionicons name="trash-outline" size={19} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={C.primaryDark} barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>My Cart</Text>
        </View>
        {/* ✅ Use HeaderCartOrders component */}
        <HeaderCartOrders navigation={navigation} />
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyWrap}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="cart-outline" size={60} color={C.primary} />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySub}>Add items you love to get started</Text>
          <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.shopBtnTxt}>Browse Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.footer}>
            <View style={styles.footerRow}>
              <Text style={styles.footerLabel}>Items</Text>
              <Text style={styles.footerVal}>{totalItems}</Text>
            </View>
            <View style={styles.footerRow}>
              <Text style={styles.footerLabel}>Delivery</Text>
              <Text style={[styles.footerVal, { color: "#25A244" }]}>FREE</Text>
            </View>
            <View style={[styles.footerRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmt}>₹{cartTotal.toFixed(2)}</Text>
            </View>

            <TouchableOpacity style={styles.checkoutBtn} onPress={proceedToCheckout}>
              <Text style={styles.checkoutTxt}>Proceed to Checkout</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },

  header: {
     backgroundColor: C.primary,
        paddingTop: Platform.OS === "ios" ? (isTablet ? 60 : 58) : (isTablet ? 50 : 46),
        paddingBottom: isTablet ? 22 : 21,
        paddingHorizontal: isTablet ? 24 : 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomLeftRadius: isTablet ? 30 : 25,
        borderBottomRightRadius: isTablet ? 30 : 25,
        elevation: 4,
        shadowColor: "#9D1B00",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.18)", justifyContent: "center", alignItems: "center" },
  headerCenter: { alignItems: "center" },
  headerTitle: { color: "#fff", fontSize: isTablet ? 22 : 19, fontWeight: "700" },
  headerSub: { color: "rgba(255,255,255,0.75)", fontSize: 12, marginTop: 1 },

  emptyWrap: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 30 },
  emptyIconWrap: { width: 110, height: 110, borderRadius: 55, backgroundColor: "#FEF2F2", justifyContent: "center", alignItems: "center", marginBottom: 20 },
  emptyTitle: { fontSize: 20, fontWeight: "700", color: C.textDark, marginBottom: 8 },
  emptySub: { fontSize: 14, color: C.textLight, textAlign: "center", marginBottom: 28 },
  shopBtn: { backgroundColor: C.primary, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12, elevation: 3 },
  shopBtnTxt: { color: "#fff", fontSize: 15, fontWeight: "700" },

  list: { padding: 14, paddingBottom: 220 },

  card: {
    flexDirection: "row", backgroundColor: C.surface, borderRadius: 16, marginBottom: 12, padding: 12,
    elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 5,
    borderWidth: 1, borderColor: C.border,
  },
  itemImg: { width: 82, height: 82, borderRadius: 12, backgroundColor: "#F1F5F9" },
  itemInfo: { flex: 1, marginLeft: 12, justifyContent: "space-between" },
  itemName: { fontSize: 14, fontWeight: "600", color: C.textDark, lineHeight: 19 },
  itemPrice: { fontSize: 15, fontWeight: "700", color: C.primary, marginTop: 2 },

  qtyRow: { flexDirection: "row", alignItems: "center", marginTop: 8, gap: 4 },
  qtyBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#FEF2F2", borderWidth: 1, borderColor: "#FECACA", justifyContent: "center", alignItems: "center" },
  qtyNum: { minWidth: 26, textAlign: "center", fontSize: 14, fontWeight: "700", color: C.textDark },
  itemSubtotal: { marginLeft: "auto", fontSize: 13, fontWeight: "700", color: C.textMid },
  trashBtn: { justifyContent: "center", paddingHorizontal: 4 },

  footer: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 20, paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    elevation: 14, shadowColor: "#000", shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 10,
  },
  footerRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  footerLabel: { fontSize: 14, color: C.textLight },
  footerVal: { fontSize: 14, fontWeight: "600", color: C.textDark },
  totalRow: { borderTopWidth: 1, borderTopColor: "#F1F5F9", paddingTop: 10, marginBottom: 14, marginTop: 4 },
  totalLabel: { fontSize: 17, fontWeight: "700", color: C.textDark },
  totalAmt: { fontSize: 22, fontWeight: "800", color: C.primary },
  checkoutBtn: {
    backgroundColor: C.primary, flexDirection: "row", alignItems: "center", justifyContent: "center",
    paddingVertical: 15, borderRadius: 14, gap: 10,
    elevation: 4, shadowColor: C.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.35, shadowRadius: 6,
  },
  checkoutTxt: { color: "#fff", fontSize: 17, fontWeight: "700" },
});