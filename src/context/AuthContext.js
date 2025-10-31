import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginApi } from "../api/api"; // import the API helper

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        console.log(token)
        setIsLoggedIn(true);
      }
    };
    loadToken();
  }, []);

  // Login function (connects to backend)
  const login = async (phoneNumber, password) => {
    try {
      const data = await loginApi({ phoneNumber, password });

      if (data.error) {
        alert(data.error);
        return false;
      }

      await AsyncStorage.setItem("token", data.token);
      setToken(data.token);
      // console.log(token)
      setIsLoggedIn(true);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      alert("Something went wrong");
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setToken(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
