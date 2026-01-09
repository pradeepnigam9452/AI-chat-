
import { useState } from "react";
import "./App.css";

export default function App() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://ai-chat-gilt-sigma.vercel.app/api/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: updatedMessages }),
        }
      );

      const data = await res.json();

      if (data?.reply) {
        setMessages((prev) => [...prev, data.reply]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "No reply from server." },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error connecting to server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">ChatGPT Clone</h1>

      <div className="chat-box">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message ${msg.role === "user" ? "user" : "assistant"}`}
          >
            {msg.content}
          </div>
        ))}
        {loading && <div className="message assistant">Typing...</div>}
      </div>

      <div className="input-area">
        <input
          type="text"
          value={input}
          placeholder="Type a message..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
