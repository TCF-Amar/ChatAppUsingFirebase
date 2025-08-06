import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase.js";
import useAuthStore from "../store/useAuthStore.js";
import { redirect } from "react-router-dom";
import { userService } from "../services/UserService.js";

const useAuth = () => {
    const { setUser, clearUser, setAuthentication, setLoading } = useAuthStore();

    useEffect(() => {

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setLoading(true);
            if (user) {
                setAuthentication(true);
                const userData = await userService.fetchUser(user.uid);
                setUser(userData);
                redirect("/");
            } else {
                clearUser();
                setAuthentication(false);
                redirect("/login"); 
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [setUser, clearUser, setAuthentication]);
};

export default useAuth;
