import { create } from "zustand";

const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    loading: false,

    setAuthentication: (isAuthenticated) => {
        set({ isAuthenticated });
    },

    setUser: (user) => {
        set({ user, isAuthenticated: true }); // <-- set both together
    },

    clearUser: () => {
        set({ user: null, isAuthenticated: false }); // <-- clear both
    },
    setLoading: (loading) => {
        set({ loading });
    },
}));

export default useAuthStore;
