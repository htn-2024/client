import React, { createContext, useState, useContext } from 'react';

// Create the TokenContext
export const TokenContext = createContext();

// TokenProvider component to wrap your application
export const TokenProvider = ({ children }) => {
  // Initialize state with the token from localStorage
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  // Update token and manage localStorage
  const updateToken = (newToken) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
  };

  return (
    <TokenContext.Provider value={{ token, setToken: updateToken }}>
      {children}
    </TokenContext.Provider>
  );
};

// Custom hook for using TokenContext
export const useToken = () => useContext(TokenContext);
