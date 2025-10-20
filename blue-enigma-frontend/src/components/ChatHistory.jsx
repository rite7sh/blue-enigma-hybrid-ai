import React from "react";

export const ChatHistory = ({ isOpen, onClose, sessions = [], onSelectSession, currentSessionId }) => {
  if (!isOpen) return null;

  return (
    <aside className="w-80 bg-white/90 border-l border-border shadow-xl overflow-y-auto p-4 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[hsl(var(--ocean-deep))]">Chat History</h3>
        <button onClick={onClose} className="text-sm text-gray-500 hover:text-ocean-medium">Close</button>
      </div>

      <ul className="space-y-3">
        {sessions.map((s) => (
          <li
            key={s.id}
            onClick={() => onSelectSession?.(s.id)}
            className={`p-3 rounded-md cursor-pointer hover:bg-[hsl(var(--ocean-medium))]/10 ${
              s.id === currentSessionId ? "bg-[hsl(var(--ocean-medium))]/8 border border-[hsl(var(--ocean-medium))]/20" : ""
            }`}
          >
            <div className="font-medium text-sm">{s.title}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.lastMessage}</div>
            <div className="text-[10px] text-gray-400 mt-2">{s.timestamp}</div>
          </li>
        ))}
      </ul>
    </aside>
  );
};
