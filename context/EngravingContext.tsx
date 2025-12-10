"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { EngravingData } from "@/types";

interface EngravingContextType {
  selectedEngraving: EngravingData | null;
  setSelectedEngraving: (engraving: EngravingData | null) => void;
}

const EngravingContext = createContext<EngravingContextType | undefined>(undefined);

export function EngravingProvider({ children }: { children: ReactNode }) {
  const [selectedEngraving, setSelectedEngraving] = useState<EngravingData | null>(null);

  return (
    <EngravingContext.Provider value={{ selectedEngraving, setSelectedEngraving }}>
      {children}
    </EngravingContext.Provider>
  );
}

export function useEngraving() {
  const context = useContext(EngravingContext);
  if (!context) {
    throw new Error("useEngraving must be used within an EngravingProvider");
  }
  return context;
}
