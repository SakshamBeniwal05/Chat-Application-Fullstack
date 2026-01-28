import { create } from "zustand";

export const themeStore = create((set)=>({
    currentTheme: localStorage.getItem("chat-Theme") ?? "dark",
    setTheme: (theme:string)=> {
        localStorage.setItem("chat-Theme",theme)
        set({currentTheme: theme})
    }
}))