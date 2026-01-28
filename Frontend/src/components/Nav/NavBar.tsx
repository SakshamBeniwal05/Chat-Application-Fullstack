import { Toaster } from "react-hot-toast";
import { authStore } from "../../store/auth.store";
import { Settings, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const NavBar = () => {
  const { authUser, logout } = authStore();
  return (
    <>
      <Toaster />

      <nav className="w-full bg-primary px-6 py-3 flex items-center justify-between">

        <div className="text-2xl font-bold text-primary-content">
          <Link to={'/'}> 
            LUFFY
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link to={`/settings`}>
            <button type="button" className="btn btn-sm bg-secondary text-secondary-content hover:bg-secondary/80 rounded-full  size-12">
              <Settings size={18} />
            </button>
          </Link>

          {authUser && (
            <button
              type="button"
              onClick={logout}
              className="btn btn-sm bg-accent text-accent-content hover:bg-accent/80 rounded-full size-12"
            >
              <LogOut />
            </button>
          )}
        </div>
      </nav>
    </>
  );
};

export default NavBar;
