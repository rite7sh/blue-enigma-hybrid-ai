import { useState, useRef, useEffect } from "react";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { ChatHistory } from "@/components/ChatHistory";
import { ScrollArea } from "@/components/ui/scroll-area";

const API_BASE_URL = "http://127.0.0.1:8000"; // FastAPI backend

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "👋 Hello! Welcome to Blue Enigma — your AI-powered travel companion. Where would you like to explore today?",
      isBot: true,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const scrollRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const chatSessions = [
    { id: "1", title: "Vietnam 4-day plan", lastMessage: "Suggest itinerary for Vietnam...", timestamp: "Just now" },
    { id: "2", title: "Romantic trip to Paris", lastMessage: "Best spots for couples...", timestamp: "Yesterday" },
    { id: "3", title: "Adventure in Thailand", lastMessage: "Show me hidden beaches...", timestamp: "2 days ago" },
  ];

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Typewriter effect for smooth streaming text
  const typewriterUpdate = (token) => {
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.isBot && last.id === "streaming") {
        return [
          ...prev.slice(0, -1),
          { ...last, text: last.text + token },
        ];
      } else {
        return [
          ...prev,
          {
            id: "streaming",
            text: token,
            isBot: true,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ];
      }
    });
  };

  // Send message with streaming
  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text }),
      });

      if (!response.ok) throw new Error("Failed to fetch AI response");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const parts = buffer.split("\n\n");
        buffer = parts.pop(); // keep leftover

        for (const part of parts) {
          if (part.startsWith("data:")) {
            const dataStr = part.replace(/^data:\s*/, "").trim();
            if (!dataStr || dataStr === "[DONE]") continue;

            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.token) {
                // Stream token by token with delay for typewriter effect
                for (const char of parsed.token) {
                  await new Promise((r) => setTimeout(r, 15)); // typing delay
                  typewriterUpdate(char);
                }
              }
            } catch {
              // ignore control chunks
            }
          }
        }
      }

      // finalize streamed message
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.id === "streaming") {
          return [
            ...prev.slice(0, -1),
            { ...last, id: Date.now().toString() },
          ];
        }
        return prev;
      });
    } catch (error) {
      console.error("Chat Stream Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          text: "⚠️ Something went wrong while streaming response.",
          isBot: true,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-[hsl(var(--ocean-deep))]/70 to-[hsl(var(--teal-accent))]/60">
      {/* Main Chat Section */}
      <div className="flex-1 flex flex-col backdrop-blur-sm">
        <ChatHeader onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)} />

        {/* Scrollable chat container */}
        <ScrollArea className="flex-1 p-4 md:p-6 overflow-y-auto" ref={scrollRef}>
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg.text}
                isBot={msg.isBot}
                timestamp={msg.timestamp}
              />
            ))}

            {loading && (
              <div className="text-sm text-center text-muted-foreground italic mt-2">
                ✈️ Planning your perfect itinerary...
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Section */}
        <div className="border-t border-border bg-card/50 backdrop-blur-sm p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <ChatInput onSend={handleSendMessage} disabled={loading} />
          </div>
        </div>
      </div>

      {/* Sidebar History */}
      <ChatHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        sessions={chatSessions}
        onSelectSession={(id) => console.log("Selected session:", id)}
        currentSessionId="1"
      />
    </div>
  );
};

export default Chat;
