
import { createContext, useContext, useState, useEffect } from 'react';
import { AdminAuthContextType } from './types';
import { useAdminAuthHook } from './useAdminAuthHook';
import { getAuthCache } from './authCache';

const AdminAuthContext = createContext<AdminAuthContextType>({
  isAdmin: false,
  userId: null,
  session: null,
  isCheckingAuth: true,
  logout: async () => {}
});

export const useAdminAuthContext = () => useContext(AdminAuthContext);

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isCheckingAuth, logout } = useAdminAuthHook(() => {
    // This is intentionally empty - state updates happen inside the hook
  });
  
  // Sync the context with the cache
  const [authState, setAuthState] = useState<AdminAuthContextType>({
    isAdmin: false,
    userId: null,
    session: null,
    isCheckingAuth: true,
    logout: async () => {}
  });
  
  // Update context whenever auth cache changes
  useEffect(() => {
    const authCache = getAuthCache();
    if (!isCheckingAuth && authCache) {
      setAuthState({
        isAdmin: authCache.isAdmin,
        userId: authCache.userId,
        session: authCache.session,
        isCheckingAuth,
        logout
      });
    } else {
      setAuthState(prev => ({ ...prev, isCheckingAuth, logout }));
    }
  }, [isCheckingAuth, logout]);
  
  return (
    <AdminAuthContext.Provider value={authState}>
      {children}
    </AdminAuthContext.Provider>
  );
};
