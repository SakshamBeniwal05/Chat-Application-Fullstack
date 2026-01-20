import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../apis/axions.api";

export const messageStore = create((set)=>({
    isUserSearching: false,
    isMessageCollecting: false,
    otherUsers: null,
    getUsers: async()=>{
        set({isUserSearching: true})
        try {
            const res = await axiosInstance.get('/message/getUsers')
            set({otherUsers: res.data})
        } catch (error) {
            toast.error("Can't Find Users")            
        }
        finally{
            set({isUserSearching: false})
        }
    }

}))