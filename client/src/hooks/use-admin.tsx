import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminState {
  isAuthenticated: boolean;
  authenticate: (password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAdmin = create<AdminState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      authenticate: async (password: string) => {
        try {
          const response = await fetch('/api/admin/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
          });
          
          if (response.ok) {
            set({ isAuthenticated: true });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },
      logout: () => set({ isAuthenticated: false }),
    }),
    {
      name: 'admin-auth',
    }
  )
);
