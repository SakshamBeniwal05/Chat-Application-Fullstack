import { create } from "zustand";
import { axiosInstance } from "../apis/axions.api";
import toast from "react-hot-toast";

export const authStore = create((set) => ({
    authUser: null,
    isLoggingIn: false,
    isSignningUp: false,
    isCheckingAuth: false,

    checkUser: async () => {
        set({isCheckingAuth:true})
        try {
            const res = await axiosInstance.get('/user/check')
            set({ authUser: res.data })
            return true
        } catch (error) {
            set({ authUser: null })
            toast.error(`Not Loginned Yet`)
            return false
        }
        finally {
            set({ isCheckingAuth: false })
        }
    },
    login: async (data: any) => {
        set({ isLoggingIn: true })
        try {
            const { email, password } = data
            if ([email, password].some(e => !e?.trim())) {
                toast.error("All Fields Required");
                return;
            }

            const res = await axiosInstance.post("/user/login", data)
            set({ authUser: res.data })
            toast.success("Loginned Successfully");
        } catch (error) {
            toast.error("Can't Login")
        }
        finally {
            set({ isLoggingIn: false })
        }
    },
    signUp: async (data: any) => {
        set({ isSignningUp: true })
        try {
            const { userName, fullName, email, password } = data
            if ([userName, fullName, email, password].some(e => !e?.trim())) {
                toast.error("All Fields Required");
                return;
            }
            const res = await axiosInstance.post("/user/register", data)
            set({ authUser: res.data })
            toast.success("Account Created Successfully");
        } catch (error) {
            toast.error(`Cant't Create Account`)
        }
        finally { set({ isSignningUp: false }) }
    },
    logout: async()=>{
        try {
            if (await axiosInstance.get('/user/logout')){
                set({authUser:null})
                toast.success("Logout Successfully")
            }
        } catch (error) {
            
        }
    }
}))