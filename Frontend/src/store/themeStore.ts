import { create } from "zustand";
import type { themeStoreDataType } from "../types/types";

export const themeStore = create<themeStoreDataType>((set)=>({
    currentTheme: localStorage.getItem("chat-Theme") ?? "dark",
    setTheme: (theme:string)=> {
        localStorage.setItem("chat-Theme",theme)
        set({currentTheme: theme})
    }
}))