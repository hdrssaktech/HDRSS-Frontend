// screens/CheckoutScreen.js  (route name: ProductScreenCheckout, exported as ProductScreenCart to match your navigator)
import React, { useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar, Platform,
  ScrollView, TextInput, Alert, SafeAreaView, Dimensions,
  KeyboardAvoidingView, ActivityIndicator, Linking,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useCart } from "../../context/CartContext";
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

// The number that receives payment for GPay / PhonePe / any UPI app.
const UPI_PAYEE_NUMBER = "9345803741";
const UPI_ID = `${UPI_PAYEE_NUMBER}@upi`;

// icon-only payment method boxes — tapping one just highlights it
const PAYMENT_METHODS = [
  { id: "gpay", label: "GPay", icon: "logo-google", color: "#4285F4" },
  { id: "phonepe", label: "PhonePe", icon: "phone-portrait-outline", color: "#5F259F" },
  { id: "upi", label: "UPI", icon: "qr-code-outline", color: "#F57C00" },
  { id: "card", label: "Card", icon: "card-outline", color: "#1565C0" },
  { id: "cod", label: "COD", icon: "cash-outline", color: "#2E7D32" },
];

export default function ProductScreenCart({ navigation, route }) {
  // Falls back to whatever is in the global cart if this screen was opened
  // without explicit items (e.g. deep link), otherwise uses what was passed
  // in (from "Buy Now" or from the Cart screen).
  const { cartItems, cartTotal, placeOrder } = useCart();
  const items = route.params?.items?.length ? route.params.items : cartItems;
  const totalAmount = route.params?.totalAmount ?? cartTotal;

  const [formData, setFormData] = useState({ name: "", phone: "", address: "", city: "", pincode: "", notes: "" });
  const [selectedPayment, setSelectedPayment] = useState("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const set = (field, val) => setFormData((p) => ({ ...p, [field]: val }));
  const isUpiMethod = ["gpay", "phonepe", "upi"].includes(selectedPayment);

  const validate = () => {
    if (!formData.name.trim()) { Alert.alert("Missing Info", "Please enter your name"); return false; }
    if (formData.phone.trim().length < 10) { Alert.alert("Missing Info", "Enter a valid 10-digit phone number"); return false; }
    if (!formData.address.trim()) { Alert.alert("Missing Info", "Please enter delivery address"); return false; }
    if (!formData.city.trim()) { Alert.alert("Missing Info", "Please enter city"); return false; }
    if (formData.pincode.trim().length < 6) { Alert.alert("Missing Info", "Enter a valid 6-digit pincode"); return false; }
    return true;
  };

  // Opens the UPI app (GPay / PhonePe / any UPI app) with the payee
  // number pre-filled and the order amount ready to pay.
  const openUpiPayment = () => {
    const amount = totalAmount.toFixed(2);
    const url =
      `upi://pay?pa=${UPI_ID}&pn=Store&am=${amount}&cu=INR&tn=${encodeURIComponent("Order Payment")}`;
    Linking.openURL(url).catch(() => {
      Alert.alert(
        "Couldn't open payment app",
        `Pay ₹${amount} manually to UPI ID: ${UPI_ID} (${UPI_PAYEE_NUMBER}), then place your order.`
      );
    });
  };

  const placeOrderNow = () => {
    if (!validate()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const orderDetails = {
        items,
        totalAmount,
        customerInfo: formData,
        paymentMethod: selectedPayment,
        orderId: "ORD" + Date.now().toString().slice(-8),
        orderDate: new Date().toISOString(),
      };
      // stores the order in the global context (visible from the Orders
      // button on every screen) and empties the cart
      placeOrder(orderDetails);
      navigation.navigate("ProductScreenOrderConfirm", { orderDetails });
    }, 1200);
  };

  const Field = ({ label, required, children }) => (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}{required && <Text style={styles.star}> *</Text>}</Text>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={C.primaryDark} barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Checkout</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* ── Order Summary — cleaner card layout ── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="receipt-outline" size={18} color={C.primary} />
              <Text style={styles.sectionTitle}>Order Summary</Text>
            </View>

            <View style={styles.itemsBox}>
              {items.map((item, i) => (
                <View key={i} style={[styles.orderItem, i === items.length - 1 && { borderBottomWidth: 0 }]}>
                  <View style={styles.orderItemLeft}>
                    <Text style={styles.orderItemName} numberOfLines={1}>{item.productName || "Product"}</Text>
                    <Text style={styles.orderItemQty}>Qty {item.quantity}  ·  ₹{parseFloat(item.price || 0).toFixed(2)} each</Text>
                  </View>
                  <Text style={styles.orderItemPrice}>₹{(parseFloat(item.price || 0) * item.quantity).toFixed(2)}</Text>
                </View>
              ))}
            </View>

            <View style={styles.summaryBox}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryVal}>₹{totalAmount.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery</Text>
                <Text style={[styles.summaryVal, { color: "#25A244" }]}>FREE</Text>
              </View>
              <View style={styles.grandDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.grandLabel}>Total Payable</Text>
                <Text style={styles.grandVal}>₹{totalAmount.toFixed(2)}</Text>
              </View>
            </View>
          </View>

          {/* ── Delivery Details ── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="location-outline" size={18} color={C.primary} />
              <Text style={styles.sectionTitle}>Delivery Details</Text>
            </View>

            <Field label="Full Name" required>
              <TextInput style={styles.input} placeholder="Enter your full name" placeholderTextColor="#B08F8F"
                value={formData.name} onChangeText={(v) => set("name", v)} />
            </Field>

            <Field label="Phone Number" required>
              <TextInput style={styles.input} placeholder="10-digit mobile number" placeholderTextColor="#B08F8F"
                keyboardType="phone-pad" maxLength={10}
                value={formData.phone} onChangeText={(v) => set("phone", v)} />
            </Field>

            <Field label="Delivery Address" required>
              <TextInput style={[styles.input, styles.textarea]} placeholder="House No., Street, Area..."
                placeholderTextColor="#B08F8F" multiline numberOfLines={3}
                value={formData.address} onChangeText={(v) => set("address", v)} />
            </Field>

            <View style={styles.rowFields}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Field label="City" required>
                  <TextInput style={styles.input} placeholder="City" placeholderTextColor="#B08F8F"
                    value={formData.city} onChangeText={(v) => set("city", v)} />
                </Field>
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Field label="Pincode" required>
                  <TextInput style={styles.input} placeholder="6-digit" placeholderTextColor="#B08F8F"
                    keyboardType="numeric" maxLength={6}
                    value={formData.pincode} onChangeText={(v) => set("pincode", v)} />
                </Field>
              </View>
            </View>

            <Field label="Order Notes">
              <TextInput style={[styles.input, styles.textarea]} placeholder="Any special instructions (optional)"
                placeholderTextColor="#B08F8F" multiline numberOfLines={2}
                value={formData.notes} onChangeText={(v) => set("notes", v)} />
            </Field>
          </View>

          {/* ── Payment Method — icon-only row of boxes ── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="wallet-outline" size={18} color={C.primary} />
              <Text style={styles.sectionTitle}>Payment Method</Text>
            </View>

            <View style={styles.payGrid}>
              {PAYMENT_METHODS.map((pm) => {
                const active = selectedPayment === pm.id;
                return (
                  <TouchableOpacity
                    key={pm.id}
                    style={[styles.payBox, active && { borderColor: pm.color, backgroundColor: pm.color + "12" }]}
                    onPress={() => setSelectedPayment(pm.id)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.payIconWrap, { backgroundColor: pm.color + "18" }]}>
                      <Ionicons name={pm.icon} size={22} color={pm.color} />
                    </View>
                    <Text style={[styles.payBoxLabel, active && { color: pm.color, fontWeight: "800" }]}>{pm.label}</Text>
                    {active && (
                      <View style={[styles.payCheck, { backgroundColor: pm.color }]}>
                        <Ionicons name="checkmark" size={10} color="#fff" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {isUpiMethod && (
              <View style={styles.upiCard}>
                <View style={styles.upiRow}>
                  <Ionicons name="qr-code" size={20} color={C.primary} />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.upiLabel}>Pay to</Text>
                    <Text style={styles.upiValue}>{UPI_PAYEE_NUMBER}  ({UPI_ID})</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.upiPayBtn} onPress={openUpiPayment}>
                  <Ionicons name="flash-outline" size={16} color="#fff" />
                  <Text style={styles.upiPayBtnText}>Pay ₹{totalAmount.toFixed(2)} now</Text>
                </TouchableOpacity>
                <Text style={styles.upiHint}>Opens your UPI app with the amount pre-filled. Complete the payment, then place your order below.</Text>
              </View>
            )}

            {selectedPayment === "card" && (
              <View style={styles.codNote}>
                <Ionicons name="information-circle-outline" size={16} color="#1565C0" />
                <Text style={[styles.codNoteTxt, { color: "#1565C0" }]}>Card payment link will be sent after order confirmation.</Text>
              </View>
            )}

            {selectedPayment === "cod" && (
              <View style={styles.codNote}>
                <Ionicons name="information-circle-outline" size={16} color="#2E7D32" />
                <Text style={styles.codNoteTxt}>Pay cash when your order is delivered to your door.</Text>
              </View>
            )}
          </View>

          <TouchableOpacity style={[styles.placeBtn, isSubmitting && { opacity: 0.7 }]} onPress={placeOrderNow} disabled={isSubmitting}>
            {isSubmitting ? (
              <><ActivityIndicator color="#fff" size="small" /><Text style={styles.placeTxt}>Placing Order...</Text></>
            ) : (
              <><Text style={styles.placeTxt}>Place Order  ₹{totalAmount.toFixed(2)}</Text><Ionicons name="checkmark-circle" size={22} color="#fff" /></>
            )}
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
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
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "700", textAlign: "center" },
  headerSub: { color: "rgba(255,255,255,0.7)", fontSize: 12, textAlign: "center", marginTop: 1 },

  scroll: { padding: 14, paddingBottom: 40 },

  section: {
    backgroundColor: C.surface, borderRadius: 18, padding: 16, marginBottom: 14,
    elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4,
    borderWidth: 1, borderColor: C.border,
  },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: C.textDark },

  itemsBox: { backgroundColor: "#FAF6F3", borderRadius: 14, paddingHorizontal: 12, marginBottom: 12 },
  orderItem: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#EDE0DC",
  },
  orderItemLeft: { flex: 1, marginRight: 8 },
  orderItemName: { fontSize: 13.5, color: C.textDark, fontWeight: "600" },
  orderItemQty: { fontSize: 11.5, color: C.textLight, marginTop: 2 },
  orderItemPrice: { fontSize: 13.5, fontWeight: "700", color: C.textDark },

  summaryBox: {},
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  summaryLabel: { fontSize: 14, color: C.textLight },
  summaryVal: { fontSize: 14, fontWeight: "600", color: C.textDark },
  grandDivider: { height: 1, backgroundColor: "#F1F5F9", marginVertical: 8 },
  grandLabel: { fontSize: 16, fontWeight: "700", color: C.textDark },
  grandVal: { fontSize: 20, fontWeight: "800", color: C.primary },

  fieldWrap: { marginBottom: 12 },
  label: { fontSize: 13, fontWeight: "600", color: C.textMid, marginBottom: 6 },
  star: { color: "#EF4444" },
  input: {
    borderWidth: 1.5, borderColor: C.border, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: C.textDark, backgroundColor: "#FAFAFA",
  },
  textarea: { minHeight: 72, textAlignVertical: "top" },
  rowFields: { flexDirection: "row" },

  payGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, justifyContent: "space-between" },
  payBox: {
    width: isTablet ? "18.4%" : "31%",
    aspectRatio: 1,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: "#FAFAFA",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    position: "relative",
  },
  payIconWrap: { width: 40, height: 40, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  payBoxLabel: { fontSize: 11.5, color: C.textMid, fontWeight: "600" },
  payCheck: {
    position: "absolute", top: 6, right: 6, width: 16, height: 16, borderRadius: 8,
    justifyContent: "center", alignItems: "center",
  },

  upiCard: {
    marginTop: 14, backgroundColor: "#FAF6F3", borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: C.border,
  },
  upiRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  upiLabel: { fontSize: 12, color: C.textLight },
  upiValue: { fontSize: 14, fontWeight: "700", color: C.textDark, marginTop: 1 },
  upiPayBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    backgroundColor: C.primary, borderRadius: 12, paddingVertical: 12,
  },
  upiPayBtnText: { color: "#fff", fontSize: 14, fontWeight: "700" },
  upiHint: { fontSize: 11.5, color: C.textLight, marginTop: 8, lineHeight: 16 },

  codNote: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "#F0FDF4", borderRadius: 10, padding: 10, marginTop: 12,
    borderWidth: 1, borderColor: "#BBF7D0",
  },
  codNoteTxt: { fontSize: 13, color: "#166534", flex: 1 },

  placeBtn: {
    backgroundColor: C.primary, flexDirection: "row", alignItems: "center", justifyContent: "center",
    paddingVertical: 16, borderRadius: 16, gap: 10, marginTop: 6,
    elevation: 5, shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8,
  },
  placeTxt: { color: "#fff", fontSize: 17, fontWeight: "700" },
});