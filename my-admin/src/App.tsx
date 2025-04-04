("use client");

import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./dashboard/page";
import Login from "./login/page";
import CreatePost from "./createPost/page";
import PostDetail from "../components/PostDetail";
import ProtectedRoute from "../components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/post/:id" element={<PostDetail />} />
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
