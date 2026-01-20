import { Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { authStore } from "../store/auth.store";

export const UnProtectedRoute = () => {
  const { authUser, checkUser, isCheckingAuth } = authStore();

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  if (isCheckingAuth) return null;

  if (authUser) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
