import { create } from "zustand";
import { axiosInstance } from "../apis/axions.api";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BackEND = process.env.NODE_ENV ? "http://localhost:8000/" : "/";

export const authStore = create((set, get) => ({
    authUser: null,
    isLoggingIn: false,
    isSignningUp: false,
    isCheckingAuth: false,
    isUpdatingProfile: false,
    socket: null,
    onlineUsers: "",

    checkUser: async () => {
        set({ isCheckingAuth: true })
        try {
            const res = await axiosInstance.get('/user/check')
            set({ authUser: res.data })
            return true
        } catch (error: any) {
            set({ authUser: null })
            
            if (error.response) {
                const status = error.response.status
                const message = error.response.data?.message
                
                switch (status) {
                    case 401:
                        toast.error("Not logged in yet")
                        break
                    case 403:
                        toast.error("Session expired. Please login again")
                        break
                    case 500:
                        toast.error("Server error. Please try again later")
                        break
                    default:
                        toast.error(message || "Authentication check failed")
                        break
                }
            } else if (error.request) {
                toast.error("Network error. Please check your connection")
            } else {
                toast.error("Not logged in yet")
            }
            
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
            toast.success("Logged in successfully");
        } catch (error: any) {
            console.error(error)
            
            if (error.response) {
                const status = error.response.status
                const message = error.response.data?.message
                
                switch (status) {
                    case 400:
                        toast.error(message || "Invalid email or password format")
                        break
                    case 401:
                        toast.error("Invalid credentials. Please check your email and password")
                        break
                    case 404:
                        toast.error("User not found. Please sign up first")
                        break
                    case 423:
                        toast.error("Account is locked. Please contact support")
                        break
                    case 429:
                        toast.error("Too many login attempts. Please try again later")
                        break
                    case 500:
                        toast.error("Server error. Please try again later")
                        break
                    default:
                        toast.error(message || "Login failed. Please try again")
                }
            } else if (error.request) {
                toast.error("Cannot connect to server. Please check your internet connection")
            } else {
                toast.error("Can't Login")
            }
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
        } catch (error: any) {
            console.error(error)
            
            if (error.response) {
                const status = error.response.status
                const message = error.response.data?.message
                
                switch (status) {
                    case 400:
                        toast.error(message || "Invalid input. Please check your details")
                        break
                    case 409:
                        toast.error("Email or username already exists. Please use a different one")
                        break
                    case 422:
                        toast.error("Invalid email format or weak password")
                        break
                    case 429:
                        toast.error("Too many signup attempts. Please try again later")
                        break
                    case 500:
                        toast.error("Server error. Please try again later")
                        break
                    default:
                        toast.error(message || "Failed to create account. Please try again")
                }
            } else if (error.request) {
                toast.error("Cannot connect to server. Please check your internet connection")
            } else {
                toast.error("Can't Create Account")
            }
        }
        finally { set({ isSignningUp: false }) }
    },

    logout: async () => {
        try {
            if (await axiosInstance.get('/user/logout')) {
                const { socket } = get()
                if (socket) socket.disconnect()
                set({ authUser: null, socket: null })
                toast.success("Logout Successfully")
            }
        } catch (error: any) {
            console.error(error)
            
            if (error.response) {
                const status = error.response.status
                const message = error.response.data?.message
                
                switch (status) {
                    case 401:
                        toast.error("Already logged out")
                        break
                    case 500:
                        toast.error("Server error during logout")
                        break
                    default:
                        toast.error(message || "Logout failed")
                }
            } else if (error.request) {
                toast.error("Network error. Please check your connection")
            } else {
                toast.error("Logout error occurred")
            }
        }
    },

    updateProfile: async (photo) => {
        set({ isUpdatingProfile: true })
        try {
            if (!photo) return toast.error("No photo provided")

            await axiosInstance.post("/user/updateProfile", { file: photo })

            const data = await get().checkUser()
            set({ authUser: data })
            toast.success("Profile updated successfully")
        } catch (error: any) {
            console.error("Update profile error:", error);
            
            if (error.response) {
                const status = error.response.status
                const message = error.response.data?.message
                
                switch (status) {
                    case 400:
                        toast.error(message || "Invalid file format. Please use JPG, PNG, or GIF")
                        break
                    case 401:
                        toast.error("Please login to update your profile")
                        break
                    case 413:
                        toast.error("Image is too large. Please upload a file smaller than 5MB")
                        break
                    case 415:
                        toast.error("Unsupported file type. Please use JPG, PNG, or GIF")
                        break
                    case 422:
                        toast.error(message || "Invalid image file")
                        break
                    case 500:
                        toast.error("Server error. Please try again later")
                        break
                    default:
                        toast.error(message || 'Size is bigger')
                }
            } else if (error.request) {
                toast.error("Network error. Please check your internet connection")
            } else {
                toast.error(error.response?.data?.message || 'Size is bigger')
            }
        }
        finally {
            set({ isUpdatingProfile: false })
        }
    },

    connectSocket: () => {
        const { authUser, socket } = get()
        if (!authUser || socket) return;
        const newSocket = io(BackEND, {
            query: { userId: authUser._id }
        })
        newSocket.connect()
        set({ socket: newSocket })

        newSocket.on("getOnlineUsers", (userId) => {
            set({ onlineUsers: userId })
        })
    }
}))