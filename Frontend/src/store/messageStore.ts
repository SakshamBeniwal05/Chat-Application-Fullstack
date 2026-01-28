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
        const res = await axiosInstance.post(`/message/${id}`, data)
        
        // ✅ Add message to sender's chat immediately
        set((state) => ({
            chatMessages: state.chatMessages 
                ? [...state.chatMessages, res.data] 
                : [res.data]
        }))
        
        toast.success("Message sent!")
        return true // ✅ Return success to reset form
    } catch (error) {
        console.error(error)
        toast.error('Can\'t Send Message')
        return false
    } finally {
        set({ isSendingMessage: false })
    }
},

    liveMessages: () => {
        const socket = authStore.getState().socket;
        if (!socket) return;

        socket.off("newMessage");  // Cleanup

        socket.on("newMessage", (newMessage) => {
            const state = get();

            // Only add message if it's from current conversation
            if (state.currentReciverId !== newMessage.sender) return;

            set({
                chatMessages: state.chatMessages
                    ? [...state.chatMessages, newMessage]
                    : [newMessage]
            })
        })
    }
}))