import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, UserRole } from '@/types';

interface AuthContextType {
  auth: AuthState;
  login: (email: string, password: string, role: UserRole) => boolean;
  register: (name: string, email: string, password: string, phone: string, role: UserRole) => boolean;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'user@demo.com',
    phone: '+91 9876543210',
    role: 'user',
    address: '123 Main St, Village Name'
  },
  {
    id: '2',
    name: 'Driver Singh',
    email: 'driver@demo.com',
    phone: '+91 9876543211',
    role: 'driver'
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@demo.com',
    phone: '+91 9876543212',
    role: 'admin'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  });

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('azAnythingUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setAuth({ user, isAuthenticated: true });
    }
  }, []);

  const login = (email: string, password: string, role: UserRole): boolean => {
    const user = mockUsers.find(u => u.email === email && u.role === role);
    if (user && password === 'demo123') {
      setAuth({ user, isAuthenticated: true });
      localStorage.setItem('azAnythingUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const register = (name: string, email: string, password: string, phone: string, role: UserRole): boolean => {
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      role
    };
    setAuth({ user: newUser, isAuthenticated: true });
    localStorage.setItem('azAnythingUser', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setAuth({ user: null, isAuthenticated: false });
    localStorage.removeItem('azAnythingUser');
  };

  const updateUser = (user: User) => {
    setAuth({ user, isAuthenticated: true });
    localStorage.setItem('azAnythingUser', JSON.stringify(user));
  };

  return (
    <AuthContext.Provider value={{
      auth,
      login,
      register,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};