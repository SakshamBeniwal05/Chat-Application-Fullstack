import { Outlet } from "react-router-dom"
import NavBar from "./components/Nav/NavBar"
import { themeStore } from "./store/themeStore"
import { useEffect } from "react"
function App() {

  const { currentTheme } = themeStore()
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme)
  }, [currentTheme])
  return (
    <div data-theme="Cyberpunk">
      <NavBar />
      <Outlet />
    </div>
  )
}

export default App
