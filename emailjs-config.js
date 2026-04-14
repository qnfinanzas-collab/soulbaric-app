// ╔══════════════════════════════════════════════════════════════════════╗
// ║  SOULBARIC — Agente de Envío de Documentación (EmailJS)             ║
// ║  Edita SOLO este archivo para configurar el sistema de email         ║
// ╠══════════════════════════════════════════════════════════════════════╣
// ║  SETUP (5 min):                                                       ║
// ║  1. Crea cuenta en https://emailjs.com  (gratis · 200 emails/mes)    ║
// ║  2. Add Service → Gmail → conectar qn.finanzas@gmail.com             ║
// ║  3. Crear Template 1 (docs al prospecto) — ver comentarios abajo     ║
// ║  4. Crear Template 2 (alerta al equipo)  — ver comentarios abajo     ║
// ║  5. Pega tu Public Key abajo                                          ║
// ║  6. Cambia configured: true                                           ║
// ╚══════════════════════════════════════════════════════════════════════╝

var EMAILJS_SOULBARIC = {

  // ── Credenciales (rellenar tras crear cuenta en emailjs.com) ──────────
  publicKey:         'PEGAR_TU_PUBLIC_KEY_AQUI',  // Dashboard → Account → General
  serviceId:         'service_soulbaric',           // Nombre del Service en EmailJS
  templateProspecto: 'template_docs_prospecto',     // Template enviado al inversor
  templateEquipo:    'template_equipo_alerta',      // Template notificación interna

  // ── Datos fijos ────────────────────────────────────────────────────────
  teamEmail: 'qn.finanzas@gmail.com',
  baseUrl:   'https://soulbaric-app.vercel.app',

  // ── Estado ─────────────────────────────────────────────────────────────
  // Cambiar a true cuando hayas completado el setup
  configured: false
};


// ══════════════════════════════════════════════════════════════════════════
// TEMPLATE 1 — template_docs_prospecto
// Copia el bloque de abajo en EmailJS > Email Templates > Create Template
// Subject: SoulBaric Marbella — Documentación de Inversión
// ══════════════════════════════════════════════════════════════════════════
//
//  Estimado/a {{nombre}},
//
//  Gracias por su interés en SoulBaric Marbella — Luxury Regeneration &
//  Recovery Ecosystem.
//
//  Le enviamos acceso exclusivo a nuestra documentación de inversión:
//
//  🌐 Ficha Teaser        → {{teaser_url}}
//  🎞  Pitch Deck          → {{pitch_url}}
//  📊 Dossier Económico   → {{dossier_url}}
//
//  El Dossier Económico incluye proyecciones a 5 años, modelo de retorno,
//  análisis de sensibilidad y escenarios de exit. Es CONFIDENCIAL y está
//  reservado exclusivamente para inversores cualificados.
//
//  {{mensaje_personal}}
//
//  Para concertar una reunión o resolver cualquier duda, escríbanos a
//  qn.finanzas@gmail.com
//
//  Un cordial saludo,
//  Equipo SoulBaric · Finanzas QuickNex QN
//
//  Variables: nombre, teaser_url, pitch_url, dossier_url, mensaje_personal
//
// ══════════════════════════════════════════════════════════════════════════
// TEMPLATE 2 — template_equipo_alerta
// Subject: 🔔 Nuevo lead SoulBaric — {{nombre}} ({{empresa}})
// ══════════════════════════════════════════════════════════════════════════
//
//  ✅ Documentación enviada a nuevo prospecto
//
//  Nombre:          {{nombre}}
//  Empresa:         {{empresa}}
//  Email:           {{email_prospecto}}
//  Tipo inversor:   {{tipo_inversor}}
//  Capital aprox.:  {{capital}}
//  Mensaje:         {{mensaje}}
//  Fecha / Hora:    {{fecha}}
//  Origen:          {{origen}}
//
//  Acceder al CRM: https://soulbaric-app.vercel.app/inversores.html
//
//  Variables: nombre, empresa, email_prospecto, tipo_inversor, capital,
//             mensaje, fecha, origen
//
// ══════════════════════════════════════════════════════════════════════════


// ── Función central de envío ──────────────────────────────────────────────
// Usada por teaser.html, pitch-deck.html, dossier-financiero.html e inversores.html
// datos = { nombre, empresa, email, tipo, capital, mensaje, origen }
function soulbaricEnviarDocs(datos, onSuccess, onError) {
  var cfg = EMAILJS_SOULBARIC;

  var params = {
    nombre:            datos.nombre     || '',
    empresa:           datos.empresa    || 'No indicada',
    email_prospecto:   datos.email      || '',
    tipo_inversor:     datos.tipo       || 'A determinar',
    capital:           datos.capital    || 'No indicado',
    mensaje:           datos.mensaje    || '—',
    origen:            datos.origen     || 'Web Teaser',
    fecha:             new Date().toLocaleString('es-ES', { dateStyle:'long', timeStyle:'short' }),
    teaser_url:        cfg.baseUrl + '/teaser.html',
    pitch_url:         cfg.baseUrl + '/pitch-deck.html',
    dossier_url:       cfg.baseUrl + '/dossier-financiero.html',
    mensaje_personal:  datos.mensaje ? 'Nota del equipo: ' + datos.mensaje : '',
    to_email:          datos.email,
    to_name:           datos.nombre
  };

  // Enviar al prospecto
  emailjs.send(cfg.serviceId, cfg.templateProspecto, params, cfg.publicKey)
    .then(function() {
      // Notificar al equipo
      return emailjs.send(cfg.serviceId, cfg.templateEquipo, params, cfg.publicKey);
    })
    .then(function() {
      if (typeof onSuccess === 'function') onSuccess();
    })
    .catch(function(err) {
      console.error('EmailJS error:', err);
      if (typeof onError === 'function') onError(err);
    });
}
