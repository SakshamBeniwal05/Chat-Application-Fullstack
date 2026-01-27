import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../apis/axions.api";
import { authStore } from "./auth.store";

export const messageStore = create((set, get) => ({
    isUserSearching: false,
    isMessageCollecting: false,
    isSendingMessage: false,
    otherUsers: [],
    chatMessages: null,
    currentReciver: null,
    currentReciverId: null,
    defaultProfile: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg",

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
    setCurrentReciever: (user) => {
        set({ currentReciver: user, currentReciverId: user?._id ?? null })
    },
    getMessages: async (id: string) => {
        set({ isMessageCollecting: true })
        try {
            const res = await axiosInstance.get(`/message/${id}`)
            set({ chatMessages: res.data })

        } catch (error) {
            toast.error("Cant Find Chat")
        }
        finally {
            set({ isMessageCollecting: false })
        }
    },
    sentMessage: async (id: string, data: any) => {
        set({ isSendingMessage: true })
        try {
            await axiosInstance.post(`/message/${id}`, data)
        } catch (error) {
            toast.error('Cant Send Message')
        }
    },

    liveMessages: () => {
        const socket = authStore.getState().socket;
        socket.on("message", (message) => {
            if (get().currentReciverId !== message._id) return 1;
            set({ chatMessages: [...get().chatMessages, message] })
        })
    }
}))