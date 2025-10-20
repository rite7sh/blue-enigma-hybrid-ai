import React from "react";
import { marked } from "marked";

// Optional: configure marked for cleaner output
marked.setOptions({
  breaks: true,
  gfm: true,
});

export const ChatMessage = ({ message, isBot, timestamp }) => {
  // Convert markdown text to HTML
  const htmlContent = marked.parse(message || "");

  return (
    <div className={`mb-3 flex ${isBot ? "justify-start" : "justify-end"}`}>
      <div className="max-w-[80%]">
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm prose prose-sm max-w-none
            ${isBot
              ? "bg-white border border-border text-gray-800"
              : "bg-gradient-to-br from-[hsl(var(--ocean-deep))] to-[hsl(var(--ocean-medium))] text-white"
            }`}
          // Render HTML safely
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
        <div className="text-xs text-gray-400 mt-1 text-right">
          {timestamp}
        </div>
      </div>
    </div>
  );
};
