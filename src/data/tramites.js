// =========================================================
// Menú principal de trámites
// Define las opciones raíz visibles para el usuario en UI
// =========================================================
export const MENU_TRAMITES = [
  { key: "reins", label: "Reinscripción" },
  { key: "alta",  label: "Alta de materias" },
  { key: "baja",  label: "Baja de materias" },
  { key: "elect", label: "Liberación de electivas" },
  { key: "const", label: "Constancias y boletas" },
  { key: "ubic",  label: "Ubicación de aulas y laboratorios" },
];

// =========================================================
// Submenús por trámite
// Mapea cada clave del menú principal a sus opciones internas
// =========================================================
export const SUBMENU = {
  reins: [
    { key: "reins_req",  label: "Requisitos" },
    { key: "reins_proc", label: "Proceso"   },
  ],
  alta: [
    { key: "alta_req",  label: "Requisitos" },
    { key: "alta_proc", label: "Proceso"    },
  ],
  baja: [
    { key: "baja_req",  label: "Requisitos" },
    { key: "baja_proc", label: "Proceso"    },
  ],
  elect: [
    { key: "elect_info", label: "Requisitos" },
    { key: "elect_proc", label: "Proceso"     },
    { key: "elect_form", label: "Formas de liberar electivas" },
    { key: "elect_carrera", label: "Creditos por carrera"     },
  ],
  const: [
    { key: "const_tipos", label: "Requisitos" },
    { key: "const_proc",  label: "Proceso"            },
  ],
};

// =========================================================
/* Contenido por sub-opción
   Proporciona listas numeradas y elementos accionables (botones) para cada flujo */
// =========================================================
export const TEXTOS = {
  reins_req: [
    "Acudir a Gestión Escolar si se cuenta con baja temporal para obtener una cita.",
    "No se permiten traslapes de materias.",
    "No exceder la carga máxima de créditos.",
    "Contar con un tutor asignado.",
    "No bajar de la carga mínima; si ocurre, justificarlo mediante una solicitud.",
    "Tener credencial vigente (tramitar en la DAE en caso de no contar con ella).",
  ],
  reins_proc: [
    "Revisar la cita de reinscripción en el SAES en la fecha indicada por Gestión Escolar.",
    "Ingresar al SAES en la fecha y hora asignadas para la reinscripción.",
    "Guardar el comprobante de reinscripción disponible en el apartado de horario.",
    "Consultar en la página oficial de UPIITA las fechas de entrega de documentos según la carrera.",
    "Pagar la cuota de reinscripción en el banco y conservar el comprobante de pago.",
    "Anotar en el comprobante de pago: nombre completo, número de boleta y programa académico.",
    "Anotar en el comprobante de horario los créditos de cada materia y el total de créditos inscritos.",
    "Obtener la firma del tutor en caso de tener materias reprobadas.",
    "Solicitar el sello de servicio médico en el comprobante de reinscripción.",
    "Presentarse en Gestión Escolar con credencial, comprobante de reinscripción (original y copia) y comprobante de pago.",
    "Guardar el comprobante de reinscripción.",
  ],
  reins_faq: [
    
  ],

  alta_req: [
    "Estar inscrito en el semestre actual.",
    "No exceder la carga máxima de materias según la carrera.",
    "Asegurar que la materia a inscribir tenga lugares disponibles.",
    "Evitar traslapes de horario con las materias ya inscritas.",
    "Presentar la credencial oficial.",
    "Realizar el trámite solo en las fechas indicadas en la convocatoria.",
  ],
  alta_proc: [
    "Revisar en la página oficial de UPIITA las fechas y horarios del trámite.",
    "Acudir a Gestión Escolar en la fecha y hora indicadas en la convocatoria.",
    "Presentar credencial institucional o identificación vigente con foto, y una hoja con nombre, boleta, nombre y grupo de las materias a inscribir.",
    "La inscripción dependerá de la disponibilidad de lugares en el grupo.",
  ],

  baja_req: [
    "Estar inscrito en el semestre actual.",
    "No quedar por debajo de la carga mínima.",
    "No dar de baja unidades recursadas sin autorización del director.",
    "Presentar la credencial oficial.",
  ],
  baja_proc: [
    "Revisar el calendario de fechas y horarios en la página oficial de la UPIITA.",
    "Acudir a ventanillas de Gestión Escolar en la fecha y horario indicados.",
    "Presentar credencial institucional o identificación vigente y una hoja con nombre, boleta, grupo y unidades a dar de baja.",
    "Realizar la baja de unidades dentro de las tres primeras semanas del semestre.",

  ],

  elect_info: [
    "Haber estado inscrito en el semestre inmediato anterior o presentar dictamen del CTCE o CGC que autorice liberar electivas.",
    "Presentar dictamen si ya no hay unidades por inscribir en el SAES, excepto electivas o desfasadas.",
    "Tener al menos 5 créditos para liberar electivas por primera vez.",
  ],
  elect_proc: [
    "Llenar el formato DIE-03 (original y copia) con todas las actividades realizadas.",
    {
      type: "button",
      text: "Descarga el formato DIE-03",
      link: "https://drive.google.com/file/d/1w2OVkZ2zvAlPkk-IOjjYPTZ0SGcmBB7w/view?usp=sharing",
    },
    "Contestar e imprimir el formulario disponible en la página oficial de la UPIITA.",
    "Presentar en Gestión Escolar el formulario y el formato DIE-03 en original y copia.",
    "Presentar evidencia y formato DIE-03 de convocatorias pasadas si se tienen créditos a favor.",
  ],
  elect_form: [
    "Tomar cursos dentro o fuera del instituto en modalidad presencial o en línea (16 horas = 1 crédito).",
    "Tomar cursos de lenguas extranjeras distintas al inglés, avalados por CENLEX o CELEX, con historial académico que indique horas y nivel (16 horas = 1 crédito).",
    "Participar en actividades culturales o deportivas dentro del instituto con registro de asistencia (50 horas = 1 crédito).",
    "Asistir a congresos con un máximo de 40 horas por evento (20 horas = 1 crédito).",
  ],
  elect_carrera: [
    "Mecatrónica: 3 electivas de 7 créditos (21 créditos).",
    "Telemática: 4 electivas de 5 créditos (20 créditos).",
    "Biónica:  4 electivas de 5 créditos (20 créditos).",
  ],

  const_tipos: [
    "Contar con cuenta dada de alta en SAES.",
    "Tramitar de 3 a 5 días de anticipación.",

  ],
  const_proc: [
    "Ingresar al SAES con la sesión del alumno.",
    "Dirigirse a la sección de Alumnos.",
    "Seleccionar la subsección 'Solicitud' en el apartado de Trámite del menú lateral izquierdo.",
    "Elegir el trámite deseado.",
    "Esperar de 3 a 5 días hábiles.",
    "Ingresar a 'Trámites y seguimiento' para consultar el documento en formato ZIP.",
    "Descargar y descomprimir el archivo ZIP para acceder al documento.",
  ], 
};

// =========================================================
// Builders de payload para UI (botones del menú principal)
// Genera estructura richContent con botones MAIN:<key>
// =========================================================
export const richButtonsMain = (title) => ({
  richContent: [[
    { type: "info", title },
    ...MENU_TRAMITES.map(it => ({
      type: "button",
      text: it.label,
      action:   `MAIN:${it.key}`,
      value:    `MAIN:${it.key}`,
      postback: `MAIN:${it.key}`,
      key: it.key,
    }))
  ]]
});

// =========================================================
// Builders de payload para submenús
// Genera botones SUB:<mainKey>:<subKey> a partir de SUBMENU
// =========================================================
export const richButtonsSub = (title, mainKey) => ({
  richContent: [[
    { type: "info", title },
    ...((SUBMENU[mainKey] || []).map(it => ({
      type: "button",
      text: it.label,
      action:   `SUB:${mainKey}:${it.key}`,
      value:    `SUB:${mainKey}:${it.key}`,
      postback: `SUB:${mainKey}:${it.key}`,
      key: it.key,
    })))
  ]]
});

// =========================================================
// Builder de listas numeradas con soporte de botones
// Convierte TEXTOS[clave] en texto enumerado y botones clicables
// =========================================================
export const richListNumbers = (title = "", items = []) => {
  const lines = [];
  const buttons = [];

  let n = 1;
  for (const it of items) {
    if (typeof it === "string") {
      lines.push(`${n}. ${it}`);
      n++;
    } else if (it && typeof it === "object" && it.type === "button") {
      // guardamos el botón para renderizarlo aparte
      buttons.push({
        type: "button",
        text: it.text || "Abrir",
        link: it.link || "",
        action: it.action || "",
      });
    }
  }

  const col = [];
  col.push({
    type: "info",
    title: title || "Información",
    subtitle: lines.join("\n"),
  });

  // añadimos cada botón como elemento de la misma columna
  for (const b of buttons) col.push(b);

  return { richContent: [col] };
};

// =========================================================
// Prompt de continuación de flujo
// Ofrece al usuario continuar con otro trámite (Sí/No)
// =========================================================
export const PREGUNTA_OTRO = {
  richContent: [[
    { type: "info", title: "¿Deseas conocer información sobre otro trámite?" },
    { type: "button", text: "Sí", action: "FLOW:SI", value: "FLOW:SI", postback: "FLOW:SI" },
    { type: "button", text: "No", action: "FLOW:NO", value: "FLOW:NO", postback: "FLOW:NO" }
  ]]
};