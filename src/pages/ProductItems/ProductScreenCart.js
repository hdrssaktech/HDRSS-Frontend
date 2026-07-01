// screens/CartScreen.js
import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Image, StatusBar, Platform, Alert, SafeAreaView, Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");
const isTablet = width > 768;

export default function CartScreen({ navigation, route }) {
  const { cartItems: initialCartItems = [], onUpdateCart } = route.params || {};
  const [cartItems, setCartItems] = useState(initialCartItems);

  // Merge incoming items on mount — keeps old items and merges duplicates
  useEffect(() => {
    if (initialCartItems && initialCartItems.length > 0) {
      setCartItems((prev) => {
        const merged = [...prev];
        initialCartItems.forEach((incoming) => {
          const idx = merged.findIndex((m) => m.id === incoming.id);
          if (idx >= 0) {
            merged[idx] = { ...merged[idx], quantity: merged[idx].quantity + incoming.quantity };
          } else {
            merged.push(incoming);
          }
        });
        return merged;
      });
    }
  }, []);

  const syncCart = (updated) => {
    setCartItems(updated);
    if (onUpdateCart) onUpdateCart(updated);
  };

  const updateQuantity = (itemId, newQty) => {
    if (newQty <= 0) { removeItem(itemId); return; }
    syncCart(cartItems.map((i) => i.id === itemId ? { ...i, quantity: newQty } : i));
  };

  const removeItem = (itemId) => {
    Alert.alert("Remove Item", "Remove this item from cart?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove", style: "destructive",
        onPress: () => syncCart(cartItems.filter((i) => i.id !== itemId)),
      },
    ]);
  };

  const clearCart = () => {
    if (!cartItems.length) return;
    Alert.alert("Clear Cart", "Remove all items?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear All", style: "destructive", onPress: () => syncCart([]) },
    ]);
  };

  const totalItems = cartItems.reduce((s, i) => s + i.quantity, 0);
  const totalAmount = cartItems.reduce(
    (s, i) => s + (parseFloat(i.price) || 0) * i.quantity, 0
  );

  // ✅ FIX: navigate to "CheckoutScreen" — match EXACTLY what you register in your Stack Navigator
  const proceedToCheckout = () => {
    if (!cartItems.length) {
      Alert.alert("Empty Cart", "Please add items before checkout.");
      return;
    }
    navigation.navigate("ProductScreenCheckout", {
      items: cartItems,
      totalAmount,
      onCheckoutComplete: () => syncCart([]),
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.image || "https://via.placeholder.com/90" }}
        style={styles.itemImg}
        resizeMode="cover"
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.productName || "Product"}
        </Text>
        <Text style={styles.itemPrice}>₹{parseFloat(item.price || 0).toFixed(2)}</Text>
        <Text style={styles.itemSubtotal}>
          Subtotal: ₹{(parseFloat(item.price || 0) * item.quantity).toFixed(2)}
        </Text>

        <View style={styles.qtyRow}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
          >
            <Ionicons name="remove" size={16} color="#9D1B00" />
          </TouchableOpacity>
          <Text style={styles.qtyNum}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Ionicons name="add" size={16} color="#9D1B00" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.trashBtn} onPress={() => removeItem(item.id)}>
        <Ionicons name="trash-outline" size={20} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#9D1B00" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>My Cart</Text>
          {totalItems > 0 && (
            <Text style={styles.headerSub}>
              {totalItems} item{totalItems > 1 ? "s" : ""}
            </Text>
          )}
        </View>
        {cartItems.length > 0 ? (
          <TouchableOpacity onPress={clearCart} style={styles.clearBtn}>
            <Text style={styles.clearTxt}>Clear</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 50 }} />
        )}
      </View>

      {/* Empty State */}
      {cartItems.length === 0 ? (
        <View style={styles.emptyWrap}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="cart-outline" size={60} color="#9D1B00" />
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

          {/* Footer Summary */}
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
              <Text style={styles.totalAmt}>₹{totalAmount.toFixed(2)}</Text>
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
  container: { flex: 1, backgroundColor: "#F5F5F5" },

  /* ── Header ── */
  header: {
    backgroundColor: "#9D1B00",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 10 : 18,
    paddingBottom: 18,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 6,
    shadowColor: "#9D1B00",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center", alignItems: "center",
  },
  headerCenter: { alignItems: "center" },
  headerTitle: { color: "#fff", fontSize: isTablet ? 22 : 19, fontWeight: "700" },
  headerSub: { color: "rgba(255,255,255,0.75)", fontSize: 12, marginTop: 1 },
  clearBtn: { paddingHorizontal: 6, paddingVertical: 4 },
  clearTxt: { color: "#FFB3B3", fontSize: 14, fontWeight: "600" },

  /* ── Empty ── */
  emptyWrap: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 30 },
  emptyIconWrap: {
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: "#FEF2F2",
    justifyContent: "center", alignItems: "center", marginBottom: 20,
  },
  emptyTitle: { fontSize: 20, fontWeight: "700", color: "#1E1E1E", marginBottom: 8 },
  emptySub: { fontSize: 14, color: "#94A3B8", textAlign: "center", marginBottom: 28 },
  shopBtn: {
    backgroundColor: "#9D1B00", paddingHorizontal: 32, paddingVertical: 14,
    borderRadius: 12, elevation: 3,
  },
  shopBtnTxt: { color: "#fff", fontSize: 15, fontWeight: "700" },

  /* ── List ── */
  list: { padding: 14, paddingBottom: 210 },

  card: {
    flexDirection: "row", backgroundColor: "#fff",
    borderRadius: 16, marginBottom: 12, padding: 12,
    elevation: 3, shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 5,
  },
  itemImg: { width: 85, height: 85, borderRadius: 12, backgroundColor: "#F1F5F9" },
  itemInfo: { flex: 1, marginLeft: 12, justifyContent: "space-between" },
  itemName: { fontSize: 14, fontWeight: "600", color: "#1E1E1E", lineHeight: 19 },
  itemPrice: { fontSize: 16, fontWeight: "700", color: "#9D1B00", marginTop: 2 },
  itemSubtotal: { fontSize: 12, color: "#64748B" },
  qtyRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  qtyBtn: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: "#FEF2F2", borderWidth: 1, borderColor: "#FECACA",
    justifyContent: "center", alignItems: "center",
  },
  qtyNum: { minWidth: 28, textAlign: "center", fontSize: 15, fontWeight: "700", color: "#1E1E1E" },
  trashBtn: { justifyContent: "center", paddingHorizontal: 6 },

  /* ── Footer ── */
  footer: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 20, paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    elevation: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1, shadowRadius: 10,
  },
  footerRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  footerLabel: { fontSize: 14, color: "#64748B" },
  footerVal: { fontSize: 14, fontWeight: "600", color: "#1E1E1E" },
  totalRow: {
    borderTopWidth: 1, borderTopColor: "#F1F5F9",
    paddingTop: 10, marginBottom: 14, marginTop: 4,
  },
  totalLabel: { fontSize: 17, fontWeight: "700", color: "#1E1E1E" },
  totalAmt: { fontSize: 22, fontWeight: "800", color: "#9D1B00" },
  checkoutBtn: {
    backgroundColor: "#9D1B00",
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    paddingVertical: 15, borderRadius: 14, gap: 10,
    elevation: 4,
    shadowColor: "#9D1B00",
    shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.35, shadowRadius: 6,
  },
  checkoutTxt: { color: "#fff", fontSize: 17, fontWeight: "700" },
});