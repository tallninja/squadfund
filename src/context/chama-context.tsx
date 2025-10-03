
'use client';

import React, { createContext, useContext, useState, useMemo, ReactNode, useEffect } from 'react';
import { type Chama } from '@/lib/mock-data';
import { getChamas } from '@/lib/api';

interface ChamaContextType {
  activeChama: Chama | null;
  setActiveChama: (chama: Chama | null) => void;
  availableChamas: Chama[];
  refreshChamas: () => void;
}

const ChamaContext = createContext<ChamaContextType | undefined>(undefined);

export function ChamaProvider({ children }: { children: ReactNode }) {
  const [activeChama, setActiveChama] = useState<Chama | null>(null);
  const [availableChamas, setAvailableChamas] = useState<Chama[]>([]);

  const fetchChamas = async () => {
    const chamas = await getChamas();
    setAvailableChamas(chamas);
    if (!activeChama && chamas.length > 0) {
        setActiveChama(chamas[0]);
    }
  }

  useEffect(() => {
    fetchChamas();
  }, []);

  const value = {
    activeChama,
    setActiveChama,
    availableChamas,
    refreshChamas: fetchChamas,
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
