import React, { useState } from "react";
import { Send } from "lucide-react";

export const ChatInput = ({ onSend, disabled }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
  };

  return (
    <div className="flex gap-3">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="Type your travel question..."
        className="flex-1 border border-border rounded-2xl px-4 py-3 bg-white/95 focus:ring-2 focus:ring-[hsl(var(--teal-accent))] outline-none"
        disabled={disabled}
      />
      <button
        onClick={handleSend}
        disabled={disabled}
        className="flex items-center gap-2 bg-[hsl(var(--ocean-medium))] text-white px-5 py-3 rounded-2xl hover:bg-[hsl(var(--ocean-deep))] disabled:opacity-50"
      >
        <Send className="w-4 h-4" />
        <span className="text-sm">Send</span>
      </button>
    </div>
  );
};
