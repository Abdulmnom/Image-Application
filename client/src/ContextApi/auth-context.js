import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  // login function for LoginPage
  const login = (token, user) => {
    try {
      const safeUser = {
        id: user.id || user._id || '',
        username: user.username || '',
        email: user.email || '',
      };

      setToken(token);
      setUser(safeUser);

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(safeUser));
    } catch (e) {
      console.log(e);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;