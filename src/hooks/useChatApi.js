// src/hooks/useChatApi.js
// Hook de comunicación con la API del chatbot

import { useEffect, useRef, useState } from "react";
import {
  MENU_TRAMITES,
  SUBMENU,
  TEXTOS,
  richButtonsMain,
  richButtonsSub,
  richListNumbers,
  PREGUNTA_OTRO,
} from "../data/tramites";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

const now = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// Palabras/formatos que suelen indicar ubicación de aulas/labs
const RX_UBICACION =
  /\b(aula|sal[oó]n|laboratorio|lab|electr[oó]nica|ubicaci[oó]n|edificio|piso|biblioteca|celex|cim|tele(?:m[aá]tica)?|sd(?:\b|-?\s*[12]|[ ]?i{1,2})|ttt|tt\s*(?:tele|meca)|sala\s*de\s*c[oó]mputo|sc\s*\d+|l\s*-?\s*\d{3})\b/i;

export default function useChatApi() {
  // ====== ESTADOS ======
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hola 👋 ¿En qué trámite te puedo apoyar?",
      payload: richButtonsMain("Selecciona una opción"),
      time: now(),
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const [currentMainKey, setCurrentMainKey] = useState(null);
  const [askUbic, setAskUbic] = useState(false);

  // TRUE = el usuario debe elegir del menú principal o del Sí/No
  const [mustPickMenu, setMustPickMenu] = useState(true);

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const pushBot = (obj) =>
    setMessages((m) => [...m, { role: "bot", time: now(), ...obj }]);

  const pushPreguntaOtro = () =>
    setMessages((m) => [
      ...m,
      { role: "bot", payload: PREGUNTA_OTRO, time: now() },
    ]);

  // =========================================================
  // MANEJO DE COMANDOS (botones MAIN/SUB/FLOW)
  // =========================================================
  const tryHandleCommand = (input) => {
    // ---- MAIN:xxxx  (botones del menú principal) ----
    if (input.startsWith("MAIN:")) {
      setMustPickMenu(false);
      const mainKey = input.split(":")[1];
      setCurrentMainKey(mainKey);

      if (mainKey === "ubic") {
        // Caso especial: ubicación
        setAskUbic(true);
        pushBot({
          text: "¡Claro! ¿Qué salón o laboratorio buscas?",
        });
        return true;
      }

      // Resto de trámites → submenú
      pushBot({
        payload: richButtonsSub("¿Qué información necesitas?", mainKey),
      });
      return true;
    }

    // ---- SUB:main:sub  (botones internos de cada trámite) ----
    if (input.startsWith("SUB:")) {
      setMustPickMenu(false);
      const [, mainKey, subKey] = input.split(":");
      const items = TEXTOS[subKey] || [];
      const subItem =
        (SUBMENU[mainKey] || []).find((x) => x.key === subKey) || { label: "" };

      pushBot({ payload: richListNumbers(subItem.label || "", items) });
      pushPreguntaOtro(); // después de contestar, pregunta si quiere otro trámite
      // aquí NO activamos mustPickMenu; solo cuando el usuario contesta Sí
      return true;
    }

    // ---- FLOW:SI / FLOW:NO  (botones “¿otro trámite?”) ----
    if (input === "FLOW:SI") {
      // Quiere otro trámite → obligamos a elegir del menú
      setMustPickMenu(true);
      setCurrentMainKey(null);
      setAskUbic(false);
      pushBot({ payload: richButtonsMain("Selecciona un trámite") });
      return true;
    }

    if (input === "FLOW:NO") {
      // Cierra el flujo pero lo dejamos libre por si quiere escribir algo
      setMustPickMenu(false);
      setCurrentMainKey(null);
      setAskUbic(false);
      pushBot({
        text: "Perfecto 😊 Estoy aquí si necesitas más información.",
      });
      return true;
    }

    return false;
  };

  // Traduce comandos a texto “bonito” en la burbuja del usuario
  const humanizeUserText = (raw) => {
    if (raw.startsWith("MAIN:")) {
      const k = raw.split(":")[1];
      const it = MENU_TRAMITES.find((x) => x.key === k);
      return it?.label || raw;
    }
    if (raw.startsWith("SUB:")) {
      const [, mainKey, subKey] = raw.split(":");
      const it = (SUBMENU[mainKey] || []).find((x) => x.key === subKey);
      return it?.label || raw;
    }
    if (raw === "FLOW:SI") return "Sí";
    if (raw === "FLOW:NO") return "No";
    return raw;
  };

  // =========================================================
  // Heurística: ¿la respuesta de PLN/Dialogflow es “inútil”?
  // =========================================================
  const isUselessPLN = (arr) => {
    if (!arr || !arr.length) return true;

    const txts = arr
      .filter((x) => x.text && !x.payload)
      .map((x) => (x.text || "").trim());

    const FALLBACK_RX =
      /^(¿disculpa\??|podr[ií]as repetirlo,?\s*por favor\??|ups,?\s*no he entendido|no he entendido|no entend|no te comprendo|no comprendo|cómo\??|dec[ií]as\??)$/i;

    const allShort = txts.length && txts.every((t) => t.length <= 35);
    const hasFallbackPhrases = txts.some((t) => FALLBACK_RX.test(t));
    const noPayloads = !arr.some((x) => x.payload);

    return hasFallbackPhrases || (allShort && noPayloads);
  };

  // =========================================================
  // ENVÍO PRINCIPAL
  // =========================================================
  const sendUserMessage = async (text) => {
    const clean = String(text || "").trim();
    if (!clean) return;

    const isCommand =
      clean.startsWith("MAIN:") ||
      clean.startsWith("SUB:") ||
      clean.startsWith("FLOW:");

    // Si estamos obligando a usar menú y NO hay comando,
    // y además no estamos en modo “dame el aula/lab” → bloqueamos texto libre.
    if (mustPickMenu && !isCommand && !askUbic) {
      pushBot({
        text:
          "Upps… 🙈 Antes de continuar, debes seleccionar una opción del menú.",
      });
      // volvemos a mostrar el menú
      pushBot({
        payload: richButtonsMain("Selecciona un trámite"),
      });
      return;
    }

    // Añadimos el mensaje del usuario
    setMessages((m) => [
      ...m,
      { role: "user", text: humanizeUserText(clean), time: now() },
    ]);

    // Si es un comando (botones) lo manejamos y salimos
    if (tryHandleCommand(clean)) return;

    // ----------- Ubicación de aulas/labs -----------
    if (askUbic || RX_UBICACION.test(clean)) {
      setAskUbic(false);
      setIsTyping(true);
      try {
        const rChat = await fetch(`${API_URL}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: clean }),
        });
        const dChat = await rChat.json();
        let botMsgs = (dChat.messages || []).map((it) =>
          it.payload
            ? { role: "bot", payload: it.payload, time: now() }
            : { role: "bot", text: it.text || "", time: now() }
        );

        const nothingUseful =
          !botMsgs.length ||
          (botMsgs.length === 1 &&
            botMsgs[0].text &&
            /(no encontr|sin coincidencia|sin resultado|no hubo resultados)/i.test(
              botMsgs[0].text
            ));

        if (nothingUseful) {
          try {
            const rDf = await fetch(`${API_URL}/chat/df`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ text: clean }),
            });
            const dDf = await rDf.json();
            const fromDf = (dDf.messages || []).map((it) =>
              it.payload
                ? { role: "bot", payload: it.payload, time: now() }
                : { role: "bot", text: it.text || "", time: now() }
            );
            if (!isUselessPLN(fromDf)) {
              botMsgs = fromDf;
            }
          } catch {
            // ignoramos error de DF
          }
        }

        setMessages((m) => [
          ...m,
          ...(botMsgs.length
            ? botMsgs
            : [
                {
                  role: "bot",
                  text: "No encontré coincidencias.",
                  time: now(),
                },
              ]),
        ]);
        pushPreguntaOtro();
      } catch {
        pushBot({
          text: "No pude obtener la ubicación. Intenta de nuevo.",
        });
      } finally {
        setIsTyping(false);
      }
      return;
    }

    // ----------- Resto de frases (PLN) -----------
    setIsTyping(true);
    try {
      const r = await fetch(`${API_URL}/chat/df`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: clean }),
      });
      const d = await r.json();
      let botMsgs = (d.messages || []).map((it) =>
        it.payload
          ? { role: "bot", payload: it.payload, time: now() }
          : { role: "bot", text: it.text || "", time: now() }
      );

      if (isUselessPLN(botMsgs)) {
        botMsgs = [
          { role: "bot", text: "¿Podrías detallar tu duda?", time: now() },
        ];
      }

      setMessages((m) => [...m, ...botMsgs]);
      pushPreguntaOtro();
    } catch {
      pushBot({
        text: "Ocurrió un error al conectar con el asistente.",
      });
    } finally {
      setIsTyping(false);
    }
  };

  // Reinicio completo
  const clear = () => {
    setCurrentMainKey(null);
    setAskUbic(false);
    setMustPickMenu(true);
    setMessages([
      {
        role: "bot",
        text: "Hola 👋 ¿En qué trámite te puedo apoyar?",
        payload: richButtonsMain("Selecciona una opción"),
        time: now(),
      },
    ]);
  };

  return { messages, isTyping, sendUserMessage, endRef, clear };
}