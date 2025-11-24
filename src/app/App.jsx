import "../index.css"; // <-- agrega esta línea en la primera sección de imports
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "../styles/globals.css";
import ChatPage from "../pages/ChatPage";

function Home(){
  return (
    <div className="container">
      <section className="chat-card" style={{gridTemplateRows:"1fr auto"}}>
        <div className="empty-state">
          <div>
            <h1 style={{marginBottom:8}}>Chatbot UPIITA</h1>
            <p className="muted">Asistente informativo de trámites</p>
            <div style={{marginTop:16}}>
              <Link className="primary" to="/chat" style={{padding:"10px 14px", display:"inline-block"}}>Ir al chat</Link>
            </div>
          </div>
        </div>
        <div className="chat-input" style={{justifyContent:"flex-end"}}>
          <Link className="ghost" to="/chat">Abrir chat</Link>
        </div>
      </section>
    </div>
  );
}

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/chat" element={<ChatPage/>} />
      </Routes>
    </BrowserRouter>
  );
}