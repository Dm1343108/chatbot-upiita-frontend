import { useEffect, useRef, useState } from "react";

/* ========= Utils ========= */
const now = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const norm = (s) =>
  String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

/** Elimina emojis del texto para que la intención se base solo en palabras. */
function stripEmojis(str = "") {
  try {
    return str.replace(/[\p{Extended_Pictographic}\p{Emoji_Presentation}]/gu, "");
  } catch {
    return str.replace(
      /[\u203C-\u3299]|\u00A9|\u00AE|[\u2000-\u200D]|\uFE0F|[\u2190-\u21FF]|[\u2300-\u23FF]|[\u2460-\u24FF]|[\u25A0-\u27BF]|[\u2B00-\u2BFF]|[\u1F000-\u1FAFF]/g,
      ""
    );
  }
}

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/* ========= Menú principal ========= */
const MENU_PRINCIPAL = [
  { label: "Reinscripción", value: "reins" },
  { label: "Alta de Unidades de Aprendizaje", value: "alta" },
  { label: "Baja de Unidades de Aprendizaje", value: "baja" },
  { label: "Liberación de Electivas", value: "elect" },
  { label: "Constancias y boletas", value: "const" },
  { label: "Ubicación de Aulas y Laboratorios", value: "ubic" },
];

/* ========= Submenús ========= */
const SUB_REINS = [
  { label: "Requisitos", value: "reins_requisitos" },
  { label: "Proceso", value: "reins_proceso" },
];

const SUB_ALTA = [
  { label: "Requisitos", value: "alta_requisitos" },
  { label: "Proceso", value: "alta_proceso" },
];

const SUB_BAJA = [
  { label: "Requisitos", value: "baja_requisitos" },
  { label: "Proceso", value: "baja_proceso" },
];

const SUB_ELECT = [
  { label: "Requisitos", value: "elect_requisitos" },
  { label: "Proceso", value: "elect_proceso" },
  { label: "Formas de liberar electivas", value: "elect_formas" },
  { label: "Créditos por carrera", value: "elect_creditos" },
];

const SUB_CONST = [
  { label: "Requisitos", value: "const_requisitos" },
  { label: "Proceso", value: "const_proceso" },
];

/* ========= Textos (de ejemplo) ========= */
const TEXTOS = {
  reins_requisitos: `Requisitos — Reinscripción:
• Estar al corriente de adeudos.
• No tener traslapes de horario.
• Respetar carga máxima y mínima.
• Tutor asignado (si aplica).
• Credencial vigente.`,

  reins_proceso: `Proceso — Reinscripción:
1) Consulta calendario/adeudos.
2) Revisa oferta y horarios.
3) Preselección con tutor (si aplica).
4) Carga en línea en tu fecha.
5) Genera y liquida pago.
6) Verifica tu carga final.`,

  alta_requisitos: `Requisitos — Alta de Unidades de Aprendizaje:
• Unidad disponible en la oferta.
• Cumplir prerrequisitos.
• No exceder carga máxima.
• Validación del tutor (si aplica).`,

  alta_proceso: `Proceso — Alta de Unidades de Aprendizaje:
1) Identifica NRC/Grupo.
2) Solicita validación (si aplica).
3) Registra la unidad en sistema.
4) Confirma en tu kardex/horario.`,

  baja_requisitos: `Requisitos — Baja de Unidades de Aprendizaje:
• Estar dentro de la ventana oficial.
• No quedar por debajo de la carga mínima (o justificar).
• Sin adeudos administrativos.`,

  baja_proceso: `Proceso — Baja de Unidades de Aprendizaje:
1) Revisa fechas de baja.
2) Solicita autorización (si aplica).
3) Registra la baja en sistema.
4) Verifica en kardex/horario.`,

  elect_requisitos: `Requisitos — Liberación de Electivas:
• Cumplir horas/actividades del programa.
• Constancias y evidencias completas.
• Visto bueno del responsable.`,

  elect_proceso: `Proceso — Liberación de Electivas:
1) Elige modalidad y responsable.
2) Junta evidencias/constancias.
3) Entrega solicitud con anexos.
4) Registro y validación en sistema.`,

  elect_formas: `Formas de liberar electivas:
• Cursos optativos acreditados.
• Proyectos de investigación o TT.
• Actividades certificadas (idiomas, servicio, estancias).`,

  elect_creditos: `Créditos por carrera (ejemplo):
• Mecatrónica: hasta X créditos.
• Telemática: hasta Y créditos.
• Biónica: hasta Z créditos.
(Confirma en tu plan vigente o con tu academia).`,

  const_requisitos: `Requisitos — Constancias y boletas:
• Estar inscrito y sin adeudos.
• Identificación vigente.
• Datos correctos para emisión.`,

  const_proceso: `Proceso — Constancias y boletas:
1) Solicita el documento (ventanilla o en línea).
2) Realiza el pago (si aplica).
3) Recoge o descarga en la fecha indicada.`,
};

/* ========= Ubicación ========= */
const BUILDING_MAP = {
  "edificio 1": "/mapas/Edificio1.jpg",
  "edificio 2": "/mapas/Edificio2.jpg",
  "edificio 3": "/mapas/Edificio3.jpg",
  "edificio 4": "/mapas/Edificio4.jpg",
  "edificio central": "/mapas/EdificioCentral.jpg",
  "edificio de pesados": "/mapas/EdificioPesados.jpg",
  "pesados": "/mapas/EdificioPesados.jpg",
  "central": "/mapas/EdificioCentral.jpg",
};

function resolveLocation(query) {
  const q = norm(stripEmojis(query));
  for (const key of Object.keys(BUILDING_MAP)) {
    if (q.includes(key)) {
      return {
        image: BUILDING_MAP[key],
        text: `Ubicación — ${capitalize(key)}.
Sigue la señalética interna hasta el aula o laboratorio indicado.`,
      };
    }
  }
  const aulaNum = q.match(/\b(\d{3})\b/);
  const lCode = q.match(/\bl\s*(\d{3})\b/i);
  const raw = lCode?.[1] || aulaNum?.[1];
  if (raw) {
    const hundreds = raw[0];
    const key =
      hundreds === "1" ? "edificio 1" :
      hundreds === "2" ? "edificio 2" :
      hundreds === "3" ? "edificio 3" :
      hundreds === "4" ? "edificio 4" : "";
    if (key && BUILDING_MAP[key]) {
      const floor = raw[0];
      return {
        image: BUILDING_MAP[key],
        text: `Aula ${raw} — ${capitalize(key)}.
Guía rápida:
1) Ingresa por el acceso principal del ${capitalize(key)}.
2) Sube al piso ${floor}.
3) Localiza la señalética del aula ${raw}.`,
      };
    }
  }
  return {
    image: null,
    text: `No encontré esa ubicación.
Prueba con ejemplos como “Aula 126”, “L320” o “Edificio Central”.`,
  };
}

/* ========= Hook principal ========= */
export default function useChatMock() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [quickOptions, setQuickOptions] = useState([]);
  const [expect, setExpect] = useState(null);
  const endRef = useRef(null);

  useEffect(() => {
    if (messages.length) return;
    setMessages([{ id: 1, role: "bot", text: "¡Hola 👋! ¿En qué trámite te puedo apoyar hoy?", time: now() }]);
    setQuickOptions(MENU_PRINCIPAL);
  }, [messages.length]);

  useEffect(() => localStorage.setItem("chat_history", JSON.stringify(messages)), [messages]);
  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), [messages, isTyping, quickOptions]);

  const sendUserMessage = (text) => {
    const cleanShown = text.trim();
    const cleanLogic = stripEmojis(cleanShown);
    if (!cleanShown) return;
    setMessages((m) => [...m, { id: Date.now(), role: "user", text: cleanShown, time: now() }]);
    if (expect === "ubicacion_nombre") return handleUbicacion(cleanLogic);
    handleTextoLibre(cleanLogic);
  };

  const onSelectQuick = (value) => {
    const label = [...MENU_PRINCIPAL, ...SUB_REINS, ...SUB_ALTA, ...SUB_BAJA, ...SUB_ELECT, ...SUB_CONST]
      .find((o) => o.value === value)?.label || value;
    setMessages((m) => [...m, { id: Date.now(), role: "user", text: label, time: now() }]);
    setIsTyping(true);
    setTimeout(() => { setIsTyping(false); routeByQuick(value); }, 220);
  };

  const routeByQuick = (v) => {
    switch (v) {
      /* MENÚS principales con tono más servicial */
      case "reins":
        return ask("¡Claro! Sobre **Reinscripción**, ¿qué te gustaría consultar?", SUB_REINS);
      case "alta":
        return ask("Con gusto. Sobre **Alta de Unidades de Aprendizaje**, ¿qué necesitas revisar?", SUB_ALTA);
      case "baja":
        return ask("Entendido. Para **Baja de Unidades de Aprendizaje**, ¿qué te muestro?", SUB_BAJA);
      case "elect":
        return ask("Perfecto. Para **Liberación de Electivas**, ¿qué deseas revisar?", SUB_ELECT);
      case "const":
        return ask("Con gusto. Sobre **Constancias y boletas**, ¿qué necesitas revisar?", SUB_CONST);

      /* SUBMENÚS */
      case "reins_requisitos": return answer(TEXTOS.reins_requisitos);
      case "reins_proceso":    return answer(TEXTOS.reins_proceso);
      case "alta_requisitos":  return answer(TEXTOS.alta_requisitos);
      case "alta_proceso":     return answer(TEXTOS.alta_proceso);
      case "baja_requisitos":  return answer(TEXTOS.baja_requisitos);
      case "baja_proceso":     return answer(TEXTOS.baja_proceso);
      case "elect_requisitos": return answer(TEXTOS.elect_requisitos);
      case "elect_proceso":    return answer(TEXTOS.elect_proceso);
      case "elect_formas":     return answer(TEXTOS.elect_formas);
      case "elect_creditos":   return answer(TEXTOS.elect_creditos);
      case "const_requisitos": return answer(TEXTOS.const_requisitos);
      case "const_proceso":    return answer(TEXTOS.const_proceso);

      /* UBICACIÓN */
      case "ubic":
        setExpect("ubicacion_nombre");
        setQuickOptions([]);
        return pushBot("Perfecto 😊. Escríbeme el nombre del aula o laboratorio (ej. “Aula 126”, “L320”, “Edificio Central”).");

      default:
        return answer("Opción en desarrollo. Te regreso al menú principal.");
    }
  };

  const handleTextoLibre = (t) => {
    const n = norm(t);
    if (n.includes("reins")) return routeByQuick("reins");
    if (n.includes("alta")) return routeByQuick("alta");
    if (n.includes("baja")) return routeByQuick("baja");
    if (n.includes("elect")) return routeByQuick("elect");
    if (n.includes("const")) return routeByQuick("const");
    if (n.includes("ubic")) return routeByQuick("ubic");
    pushBot("Puedo ayudarte con Reinscripción, Altas/Bajas, Electivas, Constancias o Ubicación de aulas.");
    backToMain(false);
  };

  const handleUbicacion = (name) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const { image, text } = resolveLocation(name);
      if (image) pushBotImage(image);
      pushBot(text);
      setExpect(null);
      backToMain();
    }, 380);
  };

  /* ==== Helpers ==== */
  const ask = (text, options) => { pushBot(text); setQuickOptions(options); };
  const answer = (text) => { pushBot(text); backToMain(); };
  const pushBot = (text) => setMessages((m) => [...m, { id: Date.now()+Math.random(), role:"bot", text, time: now() }]);
  const pushBotImage = (imageUrl) => setMessages((m) => [...m, { id: Date.now()+Math.random(), role:"bot", image:imageUrl, time: now() }]);
  const backToMain = (withPrefix = true) => setTimeout(() => {
    if (withPrefix) pushBot("¿Deseas revisar otro trámite? Selecciona una opción:");
    setQuickOptions(MENU_PRINCIPAL);
  }, 300);

  const clear = () => {
    localStorage.removeItem("chat_history");
    setMessages([{ id: 1, role: "bot", text: "Nueva conversación iniciada. ¿Qué trámite necesitas revisar?", time: now() }]);
    setQuickOptions(MENU_PRINCIPAL);
    setExpect(null);
  };

  return {
  messages, isTyping, sendUserMessage, onSelectQuick,
  quickOptions, endRef, clear,
  MAIN_OPTIONS: MENU_PRINCIPAL};

}