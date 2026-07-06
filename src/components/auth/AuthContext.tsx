'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  id: string;
  name: string;
  email: string;
  companyName: string;
  role: string;
}

interface MockUserEntry {
  email: string;
  password: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<boolean>;
  register: (name: string, email: string, password: string, companyName: string) => Promise<boolean>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (email: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_USER: User = {
  id: 'usr-1',
  name: 'Alex Mitchell',
  email: 'admin@weatherops.com',
  companyName: 'Apex Logistics Corp',
  role: 'Operations Director',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mockUsers = localStorage.getItem('WEATHEROPS_MOCK_USERS');
      if (!mockUsers) {
        localStorage.setItem(
          'WEATHEROPS_MOCK_USERS',
          JSON.stringify([
            {
              email: 'admin@weatherops.com',
              password: 'password123',
              user: DEFAULT_USER,
            },
          ])
        );
      }

      const remembered = localStorage.getItem('WEATHEROPS_CURRENT_USER') || sessionStorage.getItem('WEATHEROPS_CURRENT_USER');
      let foundUser: User | null = null;
      if (remembered) {
        try {
          foundUser = JSON.parse(remembered);
        } catch (e) {}
      }

      Promise.resolve().then(() => {
        if (foundUser) setUser(foundUser);
        setIsLoading(false);
      });
    }
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const usersStr = localStorage.getItem('WEATHEROPS_MOCK_USERS');
    if (usersStr) {
      try {
        const users = JSON.parse(usersStr) as MockUserEntry[];
        const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        
        if (found) {
          setUser(found.user);
          const userJson = JSON.stringify(found.user);
          if (rememberMe) {
            localStorage.setItem('WEATHEROPS_CURRENT_USER', userJson);
          } else {
            sessionStorage.setItem('WEATHEROPS_CURRENT_USER', userJson);
          }
          setIsLoading(false);
          return true;
        }
      } catch (e) {}
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (name: string, email: string, password: string, companyName: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const usersStr = localStorage.getItem('WEATHEROPS_MOCK_USERS') || '[]';
    try {
      const users = JSON.parse(usersStr) as MockUserEntry[];
      const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
      
      if (exists) {
        setIsLoading(false);
        return false;
      }

      const newUser: User = {
        id: `usr-${Date.now()}`,
        name,
        email,
        companyName,
        role: 'Operations Manager',
      };

      users.push({
        email,
        password,
        user: newUser,
      });

      localStorage.setItem('WEATHEROPS_MOCK_USERS', JSON.stringify(users));
      
      // Auto login
      setUser(newUser);
      sessionStorage.setItem('WEATHEROPS_CURRENT_USER', JSON.stringify(newUser));
      setIsLoading(false);
      return true;
    } catch (e) {
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('WEATHEROPS_CURRENT_USER');
    sessionStorage.removeItem('WEATHEROPS_CURRENT_USER');
    router.push('/login');
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const usersStr = localStorage.getItem('WEATHEROPS_MOCK_USERS') || '[]';
    try {
      const users = JSON.parse(usersStr) as MockUserEntry[];
      return users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    } catch (e) {
      return false;
    }
  };

  const resetPassword = async (email: string, newPassword: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const usersStr = localStorage.getItem('WEATHEROPS_MOCK_USERS') || '[]';
    try {
      const users = JSON.parse(usersStr) as MockUserEntry[];
      const index = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
      if (index !== -1) {
        users[index].password = newPassword;
        localStorage.setItem('WEATHEROPS_MOCK_USERS', JSON.stringify(users));
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
