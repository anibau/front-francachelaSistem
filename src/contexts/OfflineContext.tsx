import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface OfflineContextType {
  isOnline: boolean;
  isOfflineMode: boolean;
  toggleOfflineMode: () => void;
  queueOperation: (operation: OfflineOperation) => void;
  syncOperations: () => Promise<void>;
  pendingOperations: OfflineOperation[];
}

interface OfflineOperation {
  id: string;
  type: "sale" | "product_update" | "customer_update";
  data: any;
  timestamp: string;
  retries: number;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export const useOffline = (): OfflineContextType => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error("useOffline must be used within an OfflineProvider");
  }
  return context;
};

interface OfflineProviderProps {
  children: ReactNode;
}

export const OfflineProvider: React.FC<OfflineProviderProps> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [pendingOperations, setPendingOperations] = useState<OfflineOperation[]>([]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (!isOfflineMode) {
        syncOperations();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Load pending operations from localStorage
    const storedOperations = localStorage.getItem("pendingOperations");
    if (storedOperations) {
      try {
        setPendingOperations(JSON.parse(storedOperations));
      } catch (error) {
        console.error("Error loading pending operations:", error);
      }
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isOfflineMode]);

  useEffect(() => {
    // Save pending operations to localStorage
    localStorage.setItem("pendingOperations", JSON.stringify(pendingOperations));
  }, [pendingOperations]);

  const toggleOfflineMode = () => {
    setIsOfflineMode(!isOfflineMode);
  };

  const queueOperation = (operation: OfflineOperation) => {
    setPendingOperations(prev => [...prev, operation]);
  };

  const syncOperations = async () => {
    if (!isOnline || isOfflineMode || pendingOperations.length === 0) {
      return;
    }

    const operationsToSync = [...pendingOperations];
    const failedOperations: OfflineOperation[] = [];

    for (const operation of operationsToSync) {
      try {
        // Here you would sync with your actual API
        console.log("Syncing operation:", operation);
        
        // Mock sync delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // For demo purposes, we'll assume all operations succeed
        // In a real implementation, you would call the appropriate API endpoints
        
      } catch (error) {
        console.error("Failed to sync operation:", operation, error);
        
        // Retry logic
        if (operation.retries < 3) {
          failedOperations.push({
            ...operation,
            retries: operation.retries + 1,
          });
        }
      }
    }

    setPendingOperations(failedOperations);
  };

  const value: OfflineContextType = {
    isOnline,
    isOfflineMode,
    toggleOfflineMode,
    queueOperation,
    syncOperations,
    pendingOperations,
  };

  return <OfflineContext.Provider value={value}>{children}</OfflineContext.Provider>;
};

