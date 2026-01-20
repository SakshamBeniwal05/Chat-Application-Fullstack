import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../apis/axions.api";

export const messageStore = create((set) => ({
    isUserSearching: false,
    isMessageCollecting: false,
    isSendingMessage: false,
    otherUsers: null,
    chatMessages: null,

    getUsers: async () => {
        set({ isUserSearching: true })
        try {
            const res = await axiosInstance.get('/message/getUsers')
            set({ otherUsers: res.data })
        } catch (error) {
            toast.error("Can't Find Users")
        }
        finally {
            set({ isUserSearching: false })
        }
    },
    getMessages: async () => {
        set({ isMessageCollecting: true })
        try {
            const res = await axiosInstance.get('/message/:id')
            set({ chatMessages: res.data })

        } catch (error) {
            toast.error("Cant Find Chat")
        }
        finally {
            set({ isMessageCollecting: false })
        }
    },
    sentMessage: async (data: any) => {
        set({ isSendingMessage: true })
        try {
            await axiosInstance.post('/message/:id', data)
        } catch (error) {
            toast.error('Cant Send Message')
        }
    }
}))