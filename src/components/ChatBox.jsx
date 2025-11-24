// src/components/ChatBox.jsx
import React, { useState } from "react";
import useChatApi from "../hooks/useChatApi";
import ChatMessages from "./ChatMessages";

export default function ChatBox() {
  const { sendText } = useChatApi();
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async (text) => {
    const query = text || input;
    if (!query.trim()) return;

    // pinta el mensaje del usuario
    setItems((prev) => [...prev, { role: "user", text: query }]);
    setInput("");

    try {
      const msgs = await sendText(query);
      // agrega la(s) respuesta(s) del bot tal cual vienen
      setItems((prev) => [...prev, ...msgs]);
    } catch (e) {
      setItems((prev) => [
        ...prev,
        { role: "bot", text: "Ocurrió un error consultando el servidor." },
      ]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-3">
      <ChatMessages items={items} onSend={handleSend} />
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded-lg px-3 py-2"
          placeholder="Escribe: Aula 126, L320, Laboratorio de Física..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          className="rounded-lg bg-blue-600 text-white px-4 py-2"
          onClick={() => handleSend()}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}