import React from "react";
import { Menu, Clock } from "lucide-react";

export const ChatHeader = ({ onToggleHistory }) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-white/40 backdrop-blur-md shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(var(--ocean-deep))] to-[hsl(var(--ocean-medium))] flex items-center justify-center shadow-[var(--shadow-soft)]">
          <Menu className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="text-lg font-semibold text-[hsl(var(--ocean-deep))]">Blue Enigma</div>
          <div className="text-xs text-muted-foreground">Your AI travel companion</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onToggleHistory}
          className="px-3 py-2 rounded-lg bg-white/60 hover:bg-white/80 text-sm border border-border"
        >
          History
        </button>
        <div className="text-sm text-muted-foreground flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
      </div>
    </div>
  );
};
