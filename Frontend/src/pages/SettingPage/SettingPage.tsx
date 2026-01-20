import { Toaster } from "react-hot-toast"
import { themeStore } from "../../store/themeStore"
import { Themes } from "../../utils/Themes"

const SettingPage = () => {
  const { setTheme, currentTheme } = themeStore()

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Toaster/>
      <div className="text-left mb-8">
        <div className="text-4xl font-bold mb-2">
          Theme
        </div>
        <div className="text-lg">
          Choose a Theme for your interface
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Themes.map((theme) => (
          <button
            key={theme}
            onClick={() => setTheme(theme)}
            className={`p-3 rounded-lg border-2 transition ${
              currentTheme === theme
                ? "border-accent bg-accent/10"
                : "border-base-300 hover:border-accent/50"
            }`}
          >
            <div
              data-theme={theme}
              className="flex items-center justify-center gap-2 h-16 mb-2 rounded-md"
            >
              <div className="bg-primary w-6 h-6 rounded" />
              <div className="bg-secondary w-6 h-6 rounded" />
              <div className="bg-accent w-6 h-6 rounded" />
              <div className="bg-neutral w-6 h-6 rounded" />
            </div>
            <span className="text-sm font-medium">
              {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default SettingPage