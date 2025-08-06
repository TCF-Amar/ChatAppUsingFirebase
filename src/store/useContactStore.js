import { create } from "zustand";
import { userService } from "../services/userService";

const useContactStore = create((set) => ({
    contacts: [],
    setContacts: (contacts) => set({ contacts }),

    fetchContacts: async (uid) => {
        try {
            userService.fetchAllContacts(uid)
                .then((data) => {
                    if (data) {
                        set({ contacts: data.contacts || [] });
                    } else {
                        set({ contacts: [] });
                    }
                });
        } catch (error) {
            console.error("Error fetching contacts:", error);
        }
    }
}));

export default useContactStore;
