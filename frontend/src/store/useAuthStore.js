import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create (
  persist(
    (set) => ({
      user: null,
      login: (infoUsuario) => set ({ user: infoUsuario }),
      logout: () => set ({ user: null }),
    }),
    {
      name: "user",
    }
  )
)