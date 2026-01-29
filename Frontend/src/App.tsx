import { Outlet } from "react-router-dom"
import NavBar from "./components/Nav/NavBar"
import { themeStore } from "./store/themeStore"
import { authStore } from "./store/auth.store"
import { useEffect } from "react"
import { Toaster } from "react-hot-toast"
function App() {
  
  const { currentTheme } = themeStore()
  const { authUser, connectSocket } = authStore()
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme)
  }, [currentTheme])
  
  useEffect(() => {
    if (authUser) {
      connectSocket()
    }
  }, [authUser, connectSocket])
  
  return (
    <div data-theme="Cyberpunk">
      <Toaster/>
      <NavBar />
      <Outlet />
    </div>
  )
}

export default App
