import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Chat from "./pages/Chat";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  );
}
