
import React, { createContext, useContext, useState, useMemo } from "react";

const CartContext = createContext(null);

export function ProductScreenOrder({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);

  const addToCart = (product, qty = 1) => {
    setCartItems((prev) => {
      const idx = prev.findIndex((i) => i.id === product.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
        return next;
      }
      return [...prev, { ...product, quantity: qty }];
    });
  };

  const updateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: newQty } : i))
    );
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => setCartItems([]);

  // Called by the checkout screen once an order is placed.
  // Stores the order in memory and empties the cart.
  const placeOrder = (orderDetails) => {
    setOrders((prev) => [orderDetails, ...prev]);
    clearCart();
    return orderDetails;
  };

  const cartCount = useMemo(
    () => cartItems.reduce((s, i) => s + i.quantity, 0),
    [cartItems]
  );

  const cartTotal = useMemo(
    () =>
      cartItems.reduce(
        (s, i) => s + (parseFloat(i.price) || 0) * i.quantity,
        0
      ),
    [cartItems]
  );

  const value = {
    cartItems,
    orders,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    placeOrder,
    cartCount,
    cartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside a <CartProvider>");
  }
  return ctx;
}