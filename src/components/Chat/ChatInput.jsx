import { useState, useRef } from "react";

export default function ChatInput({ onSend }) {
  const [text, setText] = useState("");
  const taRef = useRef(null);

  const submit = () => {
    const value = text.trim();
    if (!value) return;
    onSend(value);
    setText("");
    taRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const handleFocus = () => {
    setTimeout(() => {
      document.getElementById("chat-scroll")?.scrollTo({ top: 999999, behavior: "smooth" });
    }, 80);
  };

  return (
    <div className="chat-input">
      <textarea
        ref={taRef}
        className="textarea"
        placeholder="Escribe tu duda…"
        value={text}
        onChange={(e)=>setText(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        rows={1}
        autoComplete="on"
        autoCapitalize="sentences"
        autoCorrect="on"
        enterKeyHint="send"
        inputMode="text"
        aria-label="Escribe tu mensaje"
      />
      <button className="send" onClick={submit} aria-label="Enviar">Enviar ⮕</button>
    </div>
  );
}