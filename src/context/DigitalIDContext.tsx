import { createContext, useContext, useState, ReactNode } from 'react';

interface DigitalIDContextType {
  digitalID: string | null;
  setDigitalID: (id: string) => void;
}

const DigitalIDContext = createContext<DigitalIDContextType | undefined>(undefined);

export const DigitalIDProvider = ({ children }: { children: ReactNode }) => {
  const [digitalID, setDigitalID] = useState<string | null>(null);

  return (
    <DigitalIDContext.Provider value={{ digitalID, setDigitalID }}>
      {children}
    </DigitalIDContext.Provider>
  );
};

export const useDigitalID = () => {
  const context = useContext(DigitalIDContext);
  if (!context) throw new Error("useDigitalID must be used within a DigitalIDProvider");
  return context;
};
