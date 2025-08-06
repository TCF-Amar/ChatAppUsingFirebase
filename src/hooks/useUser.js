import useAuthStore from "../store/authStore";

export const useUser = () => {
    const { user, setUser, clearUser } = useAuthStore();
    return { user, setUser, clearUser };
};