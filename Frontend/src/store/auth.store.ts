import { create } from "zustand";

export const authStore = create((set)=>({
    authUser: null,
    isCheckingAuth: false,
    isLoggingIn: false,

    login: async()=>{
        set({isLoggingIn:true})
        try {
            
        } catch (error) {
            
        }
    }
}))