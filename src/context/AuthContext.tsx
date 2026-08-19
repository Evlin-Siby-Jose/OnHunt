import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile } from '../types/user';
import { StorageService } from '../services/db';

interface AuthContextType {
  user: UserProfile;
  setUserMode: (mode: 'organizer' | 'player') => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  addXP: (amount: number) => void;
  loginAsDemoUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => StorageService.getUser());

  useEffect(() => {
    StorageService.saveUser(user);
  }, [user]);

  const setUserMode = (mode: 'organizer' | 'player') => {
    setUser((prev) => ({
      ...prev,
      activeMode: mode,
      role: mode === 'organizer' ? 'organizer' : 'player',
    }));
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const addXP = (amount: number) => {
    setUser((prev) => {
      const newXp = prev.xp + amount;
      const newLevel = Math.floor(newXp / 500) + 1;
      return { ...prev, xp: newXp, level: newLevel };
    });
  };

  const loginAsDemoUser = () => {
    setUser(StorageService.getUser());
  };

  return (
    <AuthContext.Provider value={{ user, setUserMode, updateUser, addXP, loginAsDemoUser }}>
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
