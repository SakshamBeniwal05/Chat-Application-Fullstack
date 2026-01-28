import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import LoginPage from './pages/Login/Login.tsx'
import SignUpPage from './pages/Signup/SignUp.tsx'
import SettingPage from './pages/SettingPage/SettingPage.tsx'
import HomePage from './pages/HomePage/HomePage.tsx'
import { ProtectedRoute } from './components/ProtectedRoute.tsx'
import { UnProtectedRoute } from './components/unProtectedRoute.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <HomePage />
          },
          {
            path: ":slug",
            element: <HomePage />
          },
        ],
      },
      {
        element: <UnProtectedRoute />,
        children: [
          {
            path: "login",
            element: <LoginPage />,
          },
          {
            path: "register",
            element: <SignUpPage />,
          },
        ],
      },
      {
        path: "settings",
        element: <SettingPage />
      },
    ],
  },
]);


createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />,
)
