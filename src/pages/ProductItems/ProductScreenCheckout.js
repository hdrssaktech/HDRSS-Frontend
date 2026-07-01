// screens/CheckoutScreen.js  (route name: ProductScreenCart)
import React, { useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar, Platform,
  ScrollView, TextInput, Alert, SafeAreaView, Dimensions,
  KeyboardAvoidingView, ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");
const isTablet = width > 768;

const PAYMENT_METHODS = [
  { id: "gpay", label: "Google Pay", icon: "logo-google", color: "#4285F4", sub: "Pay via UPI" },
  { id: "phonepe", label: "PhonePe", icon: "phone-portrait-outline", color: "#5F259F", sub: "Pay via UPI" },
  { id: "upi", label: "Other UPI", icon: "qr-code-outline", color: "#F57C00", sub: "Any UPI app" },
  { id: "card", label: "Credit / Debit Card", icon: "card-outline", color: "#1565C0", sub: "Visa, Mastercard, RuPay" },
  { id: "cod", label: "Cash on Delivery", icon: "cash-outline", color: "#2E7D32", sub: "Pay when delivered" },
];

export default function ProductScreenCart({ navigation, route }) {
  const { items = [], totalAmount = 0, onCheckoutComplete } = route.params || {};

  const [formData, setFormData] = useState({ name: "", phone: "", address: "", city: "", pincode: "", notes: "" });
  const [selectedPayment, setSelectedPayment] = useState("cod");
  const [upiId, setUpiId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const set = (field, val) => setFormData((p) => ({ ...p, [field]: val }));

  const validate = () => {
    if (!formData.name.trim()) { Alert.alert("Missing Info", "Please enter your name"); return false; }
    if (formData.phone.trim().length < 10) { Alert.alert("Missing Info", "Enter a valid 10-digit phone number"); return false; }
    if (!formData.address.trim()) { Alert.alert("Missing Info", "Please enter delivery address"); return false; }
    if (!formData.city.trim()) { Alert.alert("Missing Info", "Please enter city"); return false; }
    if (formData.pincode.trim().length < 6) { Alert.alert("Missing Info", "Enter a valid 6-digit pincode"); return false; }
    if (["gpay", "phonepe", "upi"].includes(selectedPayment) && !upiId.trim()) {
      Alert.alert("Missing Info", "Please enter your UPI ID"); return false;
    }
    return true;
  };

  const placeOrder = () => {
    if (!validate()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (onCheckoutComplete) onCheckoutComplete();
      navigation.navigate("ProductScreenOrderConfirm", {
        orderDetails: {
          items,
          totalAmount,
          customerInfo: formData,
          paymentMethod: selectedPayment,
          orderId: "ORD" + Date.now().toString().slice(-8),
          orderDate: new Date().toISOString(),
        },
      });
    }, 1500);
  };

  const Field = ({ label, required, children }) => (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}{required && <Text style={styles.star}> *</Text>}</Text>
      {children}
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
        <View>
          <Text style={styles.headerTitle}>Checkout</Text>
          <Text style={styles.headerSub}>{items.length} item{items.length !== 1 ? "s" : ""}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Order Summary */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="receipt-outline" size={18} color="#9D1B00" />
              <Text style={styles.sectionTitle}>Order Summary</Text>
            </View>
            {items.map((item, i) => (
              <View key={i} style={styles.orderItem}>
                <View style={styles.orderItemDot} />
                <Text style={styles.orderItemName} numberOfLines={1}>{item.productName || "Product"}</Text>
                <Text style={styles.orderItemQty}>×{item.quantity}</Text>
                <Text style={styles.orderItemPrice}>₹{(parseFloat(item.price || 0) * item.quantity).toFixed(2)}</Text>
              </View>
            ))}
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryVal}>₹{totalAmount.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery</Text>
              <Text style={[styles.summaryVal, { color: "#25A244" }]}>FREE</Text>
            </View>
            <View style={[styles.summaryRow, { marginTop: 8 }]}>
              <Text style={styles.grandLabel}>Total Payable</Text>
              <Text style={styles.grandVal}>₹{totalAmount.toFixed(2)}</Text>
            </View>
          </View>

          {/* Delivery Details */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="location-outline" size={18} color="#9D1B00" />
              <Text style={styles.sectionTitle}>Delivery Details</Text>
            </View>

            <Field label="Full Name" required>
              <TextInput style={styles.input} placeholder="Enter your full name" placeholderTextColor="#94A3B8"
                value={formData.name} onChangeText={(v) => set("name", v)} />
            </Field>

            <Field label="Phone Number" required>
              <TextInput style={styles.input} placeholder="10-digit mobile number" placeholderTextColor="#94A3B8"
                keyboardType="phone-pad" maxLength={10}
                value={formData.phone} onChangeText={(v) => set("phone", v)} />
            </Field>

            <Field label="Delivery Address" required>
              <TextInput style={[styles.input, styles.textarea]}
                placeholder="House No., Street, Area..."
                placeholderTextColor="#94A3B8" multiline numberOfLines={3}
                value={formData.address} onChangeText={(v) => set("address", v)} />
            </Field>

            <View style={styles.rowFields}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Field label="City" required>
                  <TextInput style={styles.input} placeholder="City" placeholderTextColor="#94A3B8"
                    value={formData.city} onChangeText={(v) => set("city", v)} />
                </Field>
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Field label="Pincode" required>
                  <TextInput style={styles.input} placeholder="6-digit" placeholderTextColor="#94A3B8"
                    keyboardType="numeric" maxLength={6}
                    value={formData.pincode} onChangeText={(v) => set("pincode", v)} />
                </Field>
              </View>
            </View>

            <Field label="Order Notes">
              <TextInput style={[styles.input, styles.textarea]}
                placeholder="Any special instructions (optional)"
                placeholderTextColor="#94A3B8" multiline numberOfLines={2}
                value={formData.notes} onChangeText={(v) => set("notes", v)} />
            </Field>
          </View>

          {/* Payment Method */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="wallet-outline" size={18} color="#9D1B00" />
              <Text style={styles.sectionTitle}>Payment Method</Text>
            </View>

            {PAYMENT_METHODS.map((pm) => (
              <TouchableOpacity
                key={pm.id}
                style={[styles.payRow, selectedPayment === pm.id && styles.payRowActive]}
                onPress={() => setSelectedPayment(pm.id)}
              >
                <View style={[styles.payIcon, { backgroundColor: pm.color + "18" }]}>
                  <Ionicons name={pm.icon} size={22} color={pm.color} />
                </View>
                <View style={styles.payInfo}>
                  <Text style={styles.payLabel}>{pm.label}</Text>
                  <Text style={styles.paySub}>{pm.sub}</Text>
                </View>
                <View style={[styles.radio, selectedPayment === pm.id && styles.radioActive]}>
                  {selectedPayment === pm.id && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            ))}

            {/* UPI ID input for UPI methods */}
            {["gpay", "phonepe", "upi"].includes(selectedPayment) && (
              <View style={[styles.fieldWrap, { marginTop: 6 }]}>
                <Text style={styles.label}>UPI ID <Text style={styles.star}>*</Text></Text>
                <TextInput
                  style={styles.input} placeholder="yourname@upi"
                  placeholderTextColor="#94A3B8" autoCapitalize="none"
                  value={upiId} onChangeText={setUpiId}
                />
              </View>
            )}

            {selectedPayment === "cod" && (
              <View style={styles.codNote}>
                <Ionicons name="information-circle-outline" size={16} color="#2E7D32" />
                <Text style={styles.codNoteTxt}>Pay cash when your order is delivered to your door.</Text>
              </View>
            )}
          </View>

          {/* Place Order */}
          <TouchableOpacity
            style={[styles.placeBtn, isSubmitting && { opacity: 0.7 }]}
            onPress={placeOrder}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <><ActivityIndicator color="#fff" size="small" /><Text style={styles.placeTxt}>Placing Order...</Text></>
            ) : (
              <><Text style={styles.placeTxt}>Place Order  ₹{totalAmount.toFixed(2)}</Text>
              <Ionicons name="checkmark-circle" size={22} color="#fff" /></>
            )}
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },

  header: {
    backgroundColor: "#9D1B00", flexDirection: "row",
    alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 10 : 18,
    paddingBottom: 18,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
    elevation: 6, shadowColor: "#9D1B00",
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center", alignItems: "center",
  },
  headerTitle: { color: "#fff", fontSize: 19, fontWeight: "700", textAlign: "center" },
  headerSub: { color: "rgba(255,255,255,0.7)", fontSize: 12, textAlign: "center", marginTop: 1 },

  scroll: { padding: 14, paddingBottom: 40 },

  section: {
    backgroundColor: "#fff", borderRadius: 18, padding: 16,
    marginBottom: 14, elevation: 2,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4,
  },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#1E1E1E" },

  orderItem: {
    flexDirection: "row", alignItems: "center",
    paddingVertical: 7, gap: 8,
  },
  orderItemDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#9D1B00" },
  orderItemName: { flex: 1, fontSize: 13, color: "#334155", fontWeight: "500" },
  orderItemQty: { fontSize: 13, color: "#64748B", fontWeight: "600", marginRight: 4 },
  orderItemPrice: { fontSize: 13, fontWeight: "700", color: "#1E1E1E" },

  divider: { height: 1, backgroundColor: "#F1F5F9", marginVertical: 10 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  summaryLabel: { fontSize: 14, color: "#64748B" },
  summaryVal: { fontSize: 14, fontWeight: "600", color: "#1E1E1E" },
  grandLabel: { fontSize: 16, fontWeight: "700", color: "#1E1E1E" },
  grandVal: { fontSize: 20, fontWeight: "800", color: "#9D1B00" },

  fieldWrap: { marginBottom: 12 },
  label: { fontSize: 13, fontWeight: "600", color: "#334155", marginBottom: 6 },
  star: { color: "#EF4444" },
  input: {
    borderWidth: 1.5, borderColor: "#E2E8F0", borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 11,
    fontSize: 14, color: "#1E1E1E", backgroundColor: "#FAFAFA",
  },
  textarea: { minHeight: 72, textAlignVertical: "top" },
  rowFields: { flexDirection: "row" },

  payRow: {
    flexDirection: "row", alignItems: "center", gap: 12,
    padding: 12, borderRadius: 14, marginBottom: 8,
    borderWidth: 1.5, borderColor: "#E2E8F0", backgroundColor: "#FAFAFA",
  },
  payRowActive: { borderColor: "#9D1B00", backgroundColor: "#FEF2F2" },
  payIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  payInfo: { flex: 1 },
  payLabel: { fontSize: 14, fontWeight: "700", color: "#1E1E1E" },
  paySub: { fontSize: 12, color: "#64748B", marginTop: 1 },
  radio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: "#CBD5E1",
    justifyContent: "center", alignItems: "center",
  },
  radioActive: { borderColor: "#9D1B00" },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#9D1B00" },

  codNote: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "#F0FDF4", borderRadius: 10,
    padding: 10, marginTop: 4,
    borderWidth: 1, borderColor: "#BBF7D0",
  },
  codNoteTxt: { fontSize: 13, color: "#166534", flex: 1 },

  placeBtn: {
    backgroundColor: "#9D1B00", flexDirection: "row",
    alignItems: "center", justifyContent: "center",
    paddingVertical: 16, borderRadius: 16, gap: 10, marginTop: 6,
    elevation: 5, shadowColor: "#9D1B00",
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8,
  },
  placeTxt: { color: "#fff", fontSize: 17, fontWeight: "700" },
});