import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginApi, getProfileApi } from "../api/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);

  // Load token when app opens
  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        setIsLoggedIn(true);
        fetchUserProfile(storedToken);
      }
    };
    loadToken();
  }, []);

  // ------ 🔵 Fetch user profile ------
  const fetchUserProfile = async (userToken = token) => {
    try {
      const data = await getProfileApi(userToken);

      if (data?.user) {
        setUserData(data.user);
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  };

  // ------ 🟢 Login ------
  const login = async (phoneNumber, password) => {
    try {
      const data = await loginApi({ phoneNumber, password });

      if (data.error) {
        alert(data.error);
        return false;
      }

      await AsyncStorage.setItem("token", data.token);
      setToken(data.token);
      setIsLoggedIn(true);
      fetchUserProfile(data.token);

      return true;
    } catch (error) {
      console.error("Login failed:", error);
      alert("Something went wrong");
      return false;
    }
  };

  // ------ 🔴 Logout ------
  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setToken(null);
    setUserData(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        token,
        login,
        logout,
        userData,
        setUserData,
        fetchUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

