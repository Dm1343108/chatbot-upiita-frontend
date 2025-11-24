// frontend/src/pages/ChatPage.jsx
import { useState } from "react";
import Header from "../components/Header";
import MessageBubble from "../components/Chat/MessageBubble";
import TypingDots from "../components/Chat/TypingDots";
import ChatInput from "../components/Chat/ChatInput";
import ImageLightbox from "../components/ImageLightbox";
import MobileMenu from "../components/MobileMenu";
import useChatApi from "../hooks/useChatApi";

export default function ChatPage() {
  const {
    messages,
    isTyping,
    sendUserMessage,
    endRef,
    clear,
  } = useChatApi();

  const [viewerSrc, setViewerSrc] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="container">
      <section className="chat-card">
        <Header onNewChat={clear} onOpenMenu={() => setMenuOpen(true)} />

        <div className="chat-scroll" id="chat-scroll">
          {messages.length === 0 ? (
            <div className="empty-state">
              <div>
                <h2 style={{ marginBottom: 8 }}>¡Bienvenida/o! 👋</h2>
                <p>Elige un trámite o escribe “Aula 126”.</p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((m, i) => (
                <MessageBubble
                  key={m.id || `m-${i}-${m.time || ""}`}
                  role={m.role}
                  text={m.text}
                  time={m.time}
                  payload={m.payload}
                  onImageClick={(src) => setViewerSrc(src)}
                  onChipClick={sendUserMessage}
                />
              ))}

              {isTyping && (
                <div className="row bot">
                  <div className="bubble bot">
                    <TypingDots />
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </>
          )}
        </div>

        <ChatInput onSend={sendUserMessage} />
      </section>

      <ImageLightbox src={viewerSrc} onClose={() => setViewerSrc(null)} />
      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        options={[]}
        onSelect={sendUserMessage}
      />
    </div>
  );
}