import { create } from "zustand";
import { persist } from "zustand/middleware";
import { disconnectSocket } from "@/lib/socket";

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
  error: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: true,
      error: null,
      setAuth: (user, token) => {
        localStorage.setItem("auth-token", token);
        set({ user, token, error: null });
      },
      logout: () => {
        localStorage.removeItem("auth-token");
        disconnectSocket();
        set({ user: null, token: null, error: null });
      },
      updateUser: (user) => set({ user }),
    }),
    {
      name: "auth-token",
      partialize: (state) => ({ token: state.token }),
    }
  )
);

export default useAuthStore;
