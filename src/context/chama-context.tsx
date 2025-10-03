'use client';

import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { chamas, type Chama } from '@/lib/mock-data';

interface ChamaContextType {
  activeChama: Chama | null;
  setActiveChama: (chama: Chama | null) => void;
  availableChamas: Chama[];
}

const ChamaContext = createContext<ChamaContextType | undefined>(undefined);

export function ChamaProvider({ children }: { children: ReactNode }) {
  const [activeChama, setActiveChama] = useState<Chama | null>(chamas[0] ?? null);
  const availableChamas = useMemo(() => chamas, []); 

  const value = {
    activeChama,
    setActiveChama,
    availableChamas,
  };

  return <ChamaContext.Provider value={value}>{children}</ChamaContext.Provider>;
}

export function useChama() {
  const context = useContext(ChamaContext);
  if (context === undefined) {
    throw new Error('useChama must be used within a ChamaProvider');
  }
  return context;
}
