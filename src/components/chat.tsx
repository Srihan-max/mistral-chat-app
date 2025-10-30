"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => { scrollToBottom(); }, [messages, isLoading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const apiUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/api/chat`;

      const res = await axios.post(apiUrl, { messages: newMessages }, { headers: { "Content-Type": "application/json" } });

      const assistantMessage: Message = { role: "assistant", content: res.data.reply };
      setMessages([...newMessages, assistantMessage]);
    } catch (err: any) {
      console.error("Send message error:", err);
      setMessages(prev => [...prev, { role: "assistant", content: "Error: failed to send message — see console." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-96">
      <div className="flex-1 overflow-y-auto p-4 space-y-2 border rounded-xl bg-gray-50 shadow-inner">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <span className={`inline-block p-2 rounded-lg max-w-[70%] ${
              m.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
            }`}>
              {m.content}
            </span>
          </div>
        ))}
        {isLoading && (
          <div className="text-gray-500 italic animate-pulse">Assistant is typing...</div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="flex mt-4 gap-2">
        <input
          className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 rounded-lg disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
