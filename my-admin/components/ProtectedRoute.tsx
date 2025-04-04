import { getAuth } from "firebase/auth";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const auth = getAuth();

  if (!auth.currentUser) {
    return <Navigate to="/" replace />;
  }

  // if user is authenticated return child router
  return <Outlet />;
}
