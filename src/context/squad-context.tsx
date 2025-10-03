
'use client';

import React, { createContext, useContext, useState, useMemo, ReactNode, useEffect } from 'react';
import { type Squad } from '@/lib/mock-data';
import { getSquads } from '@/lib/api';

interface SquadContextType {
  activeSquad: Squad | null;
  setActiveSquad: (squad: Squad | null) => void;
  availableSquads: Squad[];
  refreshSquads: () => void;
}

const SquadContext = createContext<SquadContextType | undefined>(undefined);

export function SquadProvider({ children }: { children: ReactNode }) {
  const [activeSquad, setActiveSquad] = useState<Squad | null>(null);
  const [availableSquads, setAvailableSquads] = useState<Squad[]>([]);

  const fetchSquads = async () => {
    const squads = await getSquads();
    setAvailableSquads(squads);
    if (!activeSquad && squads.length > 0) {
        setActiveSquad(squads[0]);
    }
  }

  useEffect(() => {
    fetchSquads();
  }, []);

  const value = {
    activeSquad,
    setActiveSquad,
    availableSquads,
    refreshSquads: fetchSquads,
  };

  return <SquadContext.Provider value={value}>{children}</SquadContext.Provider>;
}

export function useSquad() {
  const context = useContext(SquadContext);
  if (context === undefined) {
    throw new Error('useSquad must be used within a SquadProvider');
  }
  return context;
}
