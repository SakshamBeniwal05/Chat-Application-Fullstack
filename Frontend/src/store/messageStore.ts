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
        } catch (error: any) {
            console.error(error)
            
            if (error.response) {
                const status = error.response.status
                const message = error.response.data?.message
                
                switch (status) {
                    case 401:
                        toast.error("Please login to view users")
                        break
                    case 403:
                        toast.error("You don't have permission to view users")
                        break
                    case 404:
                        toast.error("No users found")
                        break
                    case 500:
                        toast.error("Server error. Please try again later")
                        break
                    default:
                        toast.error(message || "Can't Find Users")
                }
            } else if (error.request) {
                toast.error("Network error. Please check your connection")
            } else {
                toast.error("Can't Find Users")
            }
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

        } catch (error: any) {
            console.error(error)
            
            if (error.response) {
                const status = error.response.status
                const message = error.response.data?.message
                
                switch (status) {
                    case 400:
                        toast.error("Invalid user ID")
                        break
                    case 401:
                        toast.error("Please login to view messages")
                        break
                    case 403:
                        toast.error("You don't have permission to view this chat")
                        break
                    case 404:
                        toast.error("Chat not found or user doesn't exist")
                        break
                    case 500:
                        toast.error("Server error. Please try again later")
                        break
                    default:
                        toast.error(message || "Can't Find Chat")
                }
            } else if (error.request) {
                toast.error("Network error. Please check your connection")
            } else {
                toast.error("Can't Find Chat")
            }
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
        } catch (error: any) {
            console.error(error)
            
            if (error.response) {
                const status = error.response.status
                const message = error.response.data?.message
                
                switch (status) {
                    case 400:
                        toast.error(message || "Invalid message format or empty message")
                        break
                    case 401:
                        toast.error("Please login to send messages")
                        break
                    case 403:
                        toast.error("You don't have permission to message this user")
                        break
                    case 404:
                        toast.error("User not found")
                        break
                    case 413:
                        toast.error("Image is too large. Please upload a smaller file")
                        break
                    case 415:
                        toast.error("Unsupported file type. Please use JPG, PNG, or GIF")
                        break
                    case 429:
                        toast.error("Too many messages. Please wait a moment")
                        break
                    case 500:
                        toast.error("Server error. Please try again later")
                        break
                    default:
                        toast.error(message || "Can't Send Message")
                }
            } else if (error.request) {
                toast.error("Network error. Message not sent. Please check your connection")
            } else {
                toast.error('Can\'t Send Message')
            }
            
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