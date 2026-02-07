import axios from "axios"

export const axiosInstance = axios.create({
    baseURL: import.meta.env.NODE_ENV ? "http://localhost:8000/api" : "https://chat-application-fullstack-pgs6.onrender.com/api",
    withCredentials: true
})