import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <main style={{ padding: 20, textAlign: "center" }}>
      <h1>Chatbot UPIITA</h1>
      <p>Asistente informativo de trámites</p>
      <Link to="/chat">Ir al chat</Link>
    </main>
  );
}
