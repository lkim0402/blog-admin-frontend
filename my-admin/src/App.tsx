("use client");

import { Routes, Route } from "react-router-dom";
import Dashboard from "./dashboard/page";
import Home from "./home/page";
import CreatePost from "./createPost/page";
import PostDetail from "../components/postDetail";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create" element={<CreatePost />} />
      <Route path="/post/:id" element={<PostDetail />} />
    </Routes>
  );
}
