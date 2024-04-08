import React, { createContext, useContext, useState, useEffect } from "react";

// Create the AuthContext
const AuthContext = createContext();

// Create a custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// Create the AuthProvider component
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [userToken, setUserToken] = useState("");

  useEffect(() => {
    // Check if authentication info is stored in localStorage
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    if (storedToken && storedRole) {
      setIsLoggedIn(true);
      setUserToken(storedToken);
      setUserRole(storedRole);
    }
  }, []);

  const login = (userRole,token,user) => {
    setIsLoggedIn(true);
    setUserRole(userRole);
    setUserToken(token);
    localStorage.setItem("token", token); // Store token in localStorage
    localStorage.setItem("role", userRole); // Store role in localStorage
    localStorage.setItem("user", JSON.stringify(user)); // Store role in localStorage
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setUserToken(null);
    localStorage.removeItem("role"); // Remove role from localStorage
    localStorage.removeItem("token"); // Remove role from localStorage
    localStorage.removeItem("user"); // Remove user from localStorage
  };

  // Value to be provided to components
  const authContextValue = {
    isLoggedIn,
    userRole,
    userToken,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
