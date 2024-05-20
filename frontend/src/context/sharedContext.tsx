import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

const SharedContext = createContext(null);

export function SharedProvider({ children }) {
  const [sharedState, setSharedState] = useState({
    isWalletListModalOpen: false,
    isNotDRepErrorModalOpen: false,
    isMobileDrawerOpen: false,
  });

  const updateSharedState = useCallback((newState) => {
    setSharedState((prevState) => ({ ...prevState, ...newState }));
  }, []);

  const value = useMemo(() => ({
    sharedState,
    updateSharedState,
  }), [sharedState, updateSharedState]);

  return (
    <SharedContext.Provider value={value}>
      {children}
    </SharedContext.Provider>
  );
}

export function useSharedContext() {
  const context = useContext(SharedContext);
  if (!context) {
    throw new Error('useSharedContext must be used within a SharedProvider');
  }
  return context;
}
