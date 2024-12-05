import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { disconnectSocket } from '@/lib/socket';
import { auth } from '@/lib/api';

interface User {
  _id: string;
  email: string;
  username: string;
  fullName: string;
  profilePic: string;
  bio: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  checkAuth: () => Promise<void>;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: true,
      error: null,
      setAuth: (user, token) => {
        localStorage.setItem('auth-token', token);
        set({ user, token, isLoading: false, error: null });
      },
      logout: () => {
        localStorage.removeItem('auth-token');
        disconnectSocket();
        set({ user: null, token: null, isLoading: false, error: null });
      },
      updateUser: (user) => set({ user }),
      checkAuth: async () => {
        try {
          const token = localStorage.getItem('auth-token');
          if (!token) {
            set({ isLoading: false });
            return;
          }

          const response = await auth.validateToken(token);
          set({ 
            user: response.user, 
            token, 
            isLoading: false, 
            error: null 
          });
        } catch (error) {
          localStorage.removeItem('auth-token');
          set({ 
            user: null, 
            token: null, 
            isLoading: false, 
            error: 'Authentication failed' 
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
);

export default useAuthStore;