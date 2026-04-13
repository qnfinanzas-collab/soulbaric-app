/* ═══════════════════════════════════════════════════════════════
   ASISTENTE CHAT SOULBARIC — v2.0
   Chat IA con base de conocimiento hiperbárico
═══════════════════════════════════════════════════════════════ */

(function () {
  var sbOpen      = false;
  var sbFirstOpen = true;
  var sbHistory   = [];

  function norm(t) {
    return (t || '').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9 ]/g, ' ');
  }

  var INTENTS = [
    {
      kw: ['tir','tasa interna','rentabilidad interna','internal rate'],
      chips: ['¿Qué es el ROI?','¿Qué TIR puedo esperar?','¿Cómo se calcula el Payback?','¿Cómo uso el simulador?'],
      html: '<strong>TIR — Tasa Interna de Retorno</strong><br><br>Es la rentabilidad anual real de tu inversión, teniendo en cuenta el <em>momento</em> en que recibes cada pago.<br><br><table style="width:100%;border-collapse:collapse;font-size:11px;margin:8px 0;"><tr style="background:#f0ebe5;"><td style="padding:4px 6px;font-weight:700;">TIR</td><td style="padding:4px 6px;font-weight:700;">Valoración</td></tr><tr><td style="padding:4px 6px;color:#2e7d32;font-weight:700;">&gt; 20%</td><td style="padding:4px 6px;">🟢 Excelente</td></tr><tr style="background:#f9f7f5;"><td style="padding:4px 6px;color:#e65100;font-weight:700;">12–20%</td><td style="padding:4px 6px;">🟡 Muy buena</td></tr><tr><td style="padding:4px 6px;color:#ff9800;font-weight:700;">8–12%</td><td style="padding:4px 6px;">🟠 Aceptable</td></tr><tr style="background:#f9f7f5;"><td style="padding:4px 6px;color:#c62828;font-weight:700;">&lt; 8%</td><td style="padding:4px 6px;">🔴 Baja</td></tr></table>Con cámaras SoulBaric a 65–80% de ocupación, el TIR habitual está entre <strong style="color:#2e7d32;">18–35%</strong>.<br><br>📍 <em>En la app:</em> Propuestas → Inversión Operativa → <strong>Simulador</strong>'
    },
    {
      kw: ['roi','retorno sobre','return on','rentabilidad','beneficio inversor','cuanto gano','cuanto puedo ganar'],
      chips: ['¿Qué es el TIR?','¿Qué modelo de inversión elegir?','¿Cuánto cuesta una cámara?','¿Cuánto se factura al mes?'],
      html: '<strong>ROI — Retorno sobre la Inversión</strong><br><br><code style="background:#f0ebe5;padding:3px 6px;border-radius:4px;font-size:11px;">ROI = (Total recibido − Capital) / Capital × 100</code><br><br>La app calcula dos versiones:<br>• <strong>ROI total</strong> — durante toda la vida del contrato<br>• <strong>ROI anualizado</strong> — promedio por año<br><br><strong>Ejemplo:</strong> €50.000 invertidos, Revenue Share 12%, cámara 3P al 70% de ocupación durante 5 años:<br><span style="color:#2e7d32;font-weight:700;">ROI total ~180% · ROI anual ~36%</span><br><br>📍 <em>En la app:</em> Propuestas → Inversión Operativa → <strong>Simulador</strong>'
    },
    {
      kw: ['payback','recuperar','recupero','cuanto tardo','cuando recupero','amortiz'],
      chips: ['¿Qué es el TIR?','¿Qué es el ROI?','¿Qué modelos de inversión hay?','¿Qué es el período de carencia?'],
      html: '<strong>Payback — Período de Recuperación</strong><br><br>Número de <strong>meses</strong> hasta que los cobros acumulados igualan el capital invertido.<br><br><table style="width:100%;border-collapse:collapse;font-size:11px;margin:8px 0;"><tr style="background:#f0ebe5;"><td style="padding:4px 6px;font-weight:700;">Payback</td><td style="padding:4px 6px;font-weight:700;">Riesgo</td></tr><tr><td style="padding:4px 6px;color:#2e7d32;font-weight:700;">&lt; 24 meses</td><td style="padding:4px 6px;">🟢 Muy bajo</td></tr><tr style="background:#f9f7f5;"><td style="padding:4px 6px;color:#e65100;font-weight:700;">24–36 meses</td><td style="padding:4px 6px;">🟡 Bajo</td></tr><tr><td style="padding:4px 6px;color:#ff9800;font-weight:700;">36–48 meses</td><td style="padding:4px 6px;">🟠 Moderado</td></tr><tr style="background:#f9f7f5;"><td style="padding:4px 6px;color:#c62828;font-weight:700;">&gt; 48 meses</td><td style="padding:4px 6px;">🔴 Alto</td></tr></table>Con un modelo bien estructurado, el payback típico en SoulBaric es de <strong style="color:#2e7d32;">20–32 meses</strong>.'
    },
    {
      kw: ['bnp','beneficio neto','cuentas en participacion','participacion beneficio'],
      chips: ['¿Qué es Revenue Share?','¿Qué es el modelo Híbrido?','¿Qué % es recomendable?','¿Cómo añado un inversor?'],
      html: '<strong>BNP Share — Cuentas en Participación</strong><br><br>El inversor recibe un <strong>% del Beneficio Neto mensual</strong>.<br><code style="background:#f0ebe5;padding:3px 6px;border-radius:4px;font-size:11px;">Beneficio Neto = Facturación − Costes directos</code><br><br>✅ <strong>Ventajas:</strong><br>• El operador solo paga si hay beneficio<br>• Alineación de intereses inversor–operador<br>• Adecuado para inversores conservadores<br><br>⚠️ El inversor asume riesgo operativo.<br><br><em>% habitual:</em> <strong style="color:#C89968;">25–45% del BNP</strong><br><br>📍 Simulador → selector <strong>"BNP Share"</strong>'
    },
    {
      kw: ['revenue share','porcentaje facturacion','sobre facturacion','revenue'],
      chips: ['¿Qué es el BNP Share?','¿Qué es el modelo Híbrido?','¿Qué % es normal?','¿Cómo uso el simulador?'],
      html: '<strong>Revenue Share — % sobre Facturación</strong><br><br>El inversor recibe un <strong>% de la facturación bruta mensual</strong> (antes de costes).<br><br>✅ <strong>Ventajas:</strong><br>• Más predecible: no depende de la gestión de costes<br>• Mayor visibilidad para el inversor<br>• Fácil de auditar<br><br>⚠️ El operador paga incluso en meses con pocos beneficios.<br><br><em>% habitual:</em> <strong style="color:#C89968;">8–18% de la facturación neta</strong><br><br>📍 Simulador → selector <strong>"Revenue Share"</strong>'
    },
    {
      kw: ['hibrido','modelo hibrido','prima de salida','prima salida','combinado'],
      chips: ['¿Qué es el BNP Share?','¿Qué es Revenue Share?','¿Cómo añado un inversor?','¿Cuál modelo recomendáis?'],
      html: '<strong>Modelo Híbrido — BNP + Prima de Salida</strong><br><br>Combina <strong>pagos mensuales (% BNP)</strong> con una <strong>prima garantizada al final</strong> del contrato.<br><br><em>Ejemplo:</em><br>• Inversión: €80.000<br>• Mensual: 30% BNP<br>• Salida año 5: ×1,35 = <strong style="color:#6a1b9a;">€108.000</strong><br><br>✅ <strong>Ideal para:</strong><br>• Inversores grandes (&gt;€50.000)<br>• Perfiles que quieren ingresos recurrentes <em>y</em> protección del capital<br>• Contratos a 3–7 años<br><br>📍 Simulador → selector <strong>"Híbrido"</strong>'
    },
    {
      kw: ['cual modelo','que modelo','mejor modelo','modelo recomendado','como invierto','que inversion'],
      chips: ['¿Qué es el BNP Share?','¿Qué es Revenue Share?','¿Qué es el modelo Híbrido?','¿Cómo uso el simulador?'],
      html: '<strong>¿Qué modelo de inversión elegir?</strong><br><br><table style="width:100%;border-collapse:collapse;font-size:11px;margin:8px 0;"><tr style="background:#f0ebe5;"><td style="padding:4px 6px;font-weight:700;">Perfil</td><td style="padding:4px 6px;font-weight:700;">Capital</td><td style="padding:4px 6px;font-weight:700;">Modelo</td></tr><tr><td style="padding:4px 6px;">🔵 Conservador</td><td style="padding:4px 6px;">&lt;€30k</td><td style="padding:4px 6px;font-weight:700;">BNP Share</td></tr><tr style="background:#f9f7f5;"><td style="padding:4px 6px;">🟡 Moderado</td><td style="padding:4px 6px;">€30–80k</td><td style="padding:4px 6px;font-weight:700;">Revenue Share</td></tr><tr><td style="padding:4px 6px;">🔴 Agresivo</td><td style="padding:4px 6px;">&gt;€80k</td><td style="padding:4px 6px;font-weight:700;">Híbrido</td></tr></table>💡 Para primeras inversiones, <strong>Revenue Share</strong> ofrece mayor transparencia y facilita la confianza del inversor.'
    },
    {
      kw: ['hp750','he5000','diamond','hp1501','club','fort','macypan','camara hiperbarica','modelo camara','cuanto cuesta camara','precio camara'],
      chips: ['¿Cuál modelo me recomiendas?','¿Qué complementos hay?','¿Cómo crear una configuración?','¿Cómo abro el catálogo?'],
      html: '<strong>Modelos de Cámara MacyPan</strong><br><br><table style="width:100%;border-collapse:collapse;font-size:10px;margin:6px 0;"><tr style="background:#1a1a1a;color:#C89968;"><td style="padding:4px 6px;font-weight:700;">Modelo</td><td style="padding:4px 6px;font-weight:700;">Plazas</td><td style="padding:4px 6px;font-weight:700;">Precio c/IVA</td></tr><tr><td style="padding:3px 6px;">HP750</td><td style="padding:3px 6px;">1P</td><td style="padding:3px 6px;font-weight:700;">€77.171</td></tr><tr style="background:#f9f7f5;"><td style="padding:3px 6px;">HE5000 Mono</td><td style="padding:3px 6px;">2P</td><td style="padding:3px 6px;font-weight:700;">€81.171</td></tr><tr><td style="padding:3px 6px;">HE5000 Diamond</td><td style="padding:3px 6px;">2P</td><td style="padding:3px 6px;font-weight:700;">€93.471</td></tr><tr style="background:#f9f7f5;"><td style="padding:3px 6px;">HE5000 Mini</td><td style="padding:3px 6px;">2P</td><td style="padding:3px 6px;font-weight:700;">€99.571</td></tr><tr><td style="padding:3px 6px;">HE5000 Reg 1.5</td><td style="padding:3px 6px;">3P</td><td style="padding:3px 6px;font-weight:700;">€85.271</td></tr><tr style="background:#f9f7f5;"><td style="padding:3px 6px;">HE5000 Reg 1.9</td><td style="padding:3px 6px;">3P</td><td style="padding:3px 6px;font-weight:700;">€101.671</td></tr><tr><td style="padding:3px 6px;">HE5000 Club 2,5m</td><td style="padding:3px 6px;">4P</td><td style="padding:3px 6px;font-weight:700;">€113.971</td></tr><tr style="background:#f9f7f5;"><td style="padding:3px 6px;">HE5000 Club 3,0m</td><td style="padding:3px 6px;">4P</td><td style="padding:3px 6px;font-weight:700;">€124.171</td></tr><tr><td style="padding:3px 6px;">Fort / Plus / HP1501</td><td style="padding:3px 6px;">—</td><td style="padding:3px 6px;color:#888;">Consultar</td></tr></table>📍 Más detalles en: <strong>catálogo → catalogo.html</strong>'
    },
    {
      kw: ['recomiend','mejor camara','que camara','cual camara','camara recomendada'],
      chips: ['Ver precios de todas las cámaras','¿Qué complementos hay?','¿Cuánto factura al mes?','¿Cómo abro el catálogo?'],
      html: '<strong>¿Qué cámara elegir?</strong><br><br><table style="width:100%;border-collapse:collapse;font-size:11px;margin:8px 0;"><tr style="background:#f0ebe5;"><td style="padding:4px 6px;font-weight:700;">Presupuesto</td><td style="padding:4px 6px;font-weight:700;">Recomendación</td></tr><tr><td style="padding:4px 6px;">&lt; €85k</td><td style="padding:4px 6px;font-weight:700;">HP750 (1P) o HE5000 Mono (2P)</td></tr><tr style="background:#f9f7f5;"><td style="padding:4px 6px;">€85k–€100k</td><td style="padding:4px 6px;font-weight:700;">HE5000 Diamond o Reg 1.9 (3P)</td></tr><tr><td style="padding:4px 6px;">&gt; €100k</td><td style="padding:4px 6px;font-weight:700;">HE5000 Club 2,5m (4P) ← mayor ROI</td></tr></table>🏆 <strong>Mejor ROI por plaza:</strong> HE5000 Club 2,5m<br>4 plazas × €113.971 = <strong style="color:#2e7d32;">€28.493/plaza</strong><br><br>💡 A mayor capacidad, mayor facturación con los mismos costes fijos.'
    },
    {
      kw: ['complement','wellness','casco','mascara','gafas','aromaterapia','accesorios'],
      chips: ['¿Cuánto cuesta una cámara?','¿Qué logística necesito?','¿Cómo abro el catálogo?','¿Cómo crear una configuración?'],
      html: '<strong>Complementos Wellness</strong><br><br><table style="width:100%;border-collapse:collapse;font-size:11px;margin:6px 0;"><tr style="background:#f0ebe5;"><td style="padding:4px 6px;font-weight:700;">Complemento</td><td style="padding:4px 6px;font-weight:700;">Precio s/IVA</td></tr><tr><td style="padding:3px 6px;">Casco oxígeno individual</td><td style="padding:3px 6px;">€826,45</td></tr><tr style="background:#f9f7f5;"><td style="padding:3px 6px;">Máscara naso-bucal</td><td style="padding:3px 6px;">€338,84</td></tr><tr><td style="padding:3px 6px;">Gafas protectoras</td><td style="padding:3px 6px;">€94,22</td></tr><tr style="background:#f9f7f5;"><td style="padding:3px 6px;">Set bienestar premium</td><td style="padding:3px 6px;">€1.322,31</td></tr><tr><td style="padding:3px 6px;">Difusor aromaterapia</td><td style="padding:3px 6px;">€661,16</td></tr><tr style="background:#f9f7f5;"><td style="padding:3px 6px;">Pack completo wellness</td><td style="padding:3px 6px;">€3.305,79</td></tr></table>💡 Los complementos permiten subir el precio de sesión <strong>+€10–20</strong> y diferenciar la oferta.'
    },
    {
      kw: ['puesta en marcha','arranque','pre-operativo','inicio del negocio','antes de abrir','costes previos'],
      chips: ['¿Qué es el período de carencia?','¿Cómo añado partidas?','¿Entra en la inversión?','¿Cómo funciona en la app?'],
      html: '<strong>Puesta en Marcha</strong><br><br>Todos los <strong>costes previos</strong> a que la cámara esté operativa.<br><br><strong>Categorías:</strong><br>🎯 Marketing · 👥 Personal · 📚 Formación · 📋 Administración<br>🏗 Acondicionamiento · 💻 Tecnología · 🛡 Seguros · ⚖️ Legal/Notaría<br><br><strong>Tipos de partida:</strong><br>• <em>Única:</em> gasto puntual (ej. campaña de lanzamiento)<br>• <em>Mensual × N meses:</em> gasto recurrente durante el arranque<br><br>📍 <em>En la app:</em> Propuestas → Inversión Operativa → proyecto → tab <strong>🚀 Puesta en Marcha</strong><br><br>El total se puede <strong>pre-cargar como inversión operativa</strong> con un clic.'
    },
    {
      kw: ['carencia','meses sin ingresos','sin ingresos al inicio','periodo carencia'],
      chips: ['¿Qué es la Puesta en Marcha?','¿Cómo afecta al TIR?','¿Cuánto dura normalmente?','¿Cómo uso el simulador?'],
      html: '<strong>Período de Carencia</strong><br><br>Meses iniciales en los que la cámara <strong>no genera ingresos</strong> (instalación, permisos, marketing, formación).<br><br><table style="width:100%;border-collapse:collapse;font-size:11px;margin:8px 0;"><tr style="background:#f0ebe5;"><td style="padding:4px 6px;font-weight:700;">Situación</td><td style="padding:4px 6px;font-weight:700;">Carencia típica</td></tr><tr><td style="padding:4px 6px;">Centro ya operativo</td><td style="padding:4px 6px;color:#2e7d32;font-weight:700;">0–1 mes</td></tr><tr style="background:#f9f7f5;"><td style="padding:4px 6px;">Centro nuevo</td><td style="padding:4px 6px;color:#e65100;font-weight:700;">2–3 meses</td></tr><tr><td style="padding:4px 6px;">Reforma + permisos</td><td style="padding:4px 6px;color:#c62828;font-weight:700;">3–6 meses</td></tr></table>La carencia <strong>reduce el TIR y alarga el Payback</strong>.<br><br>📍 <em>En la app:</em> Puesta en Marcha → <strong>slider "Período de carencia"</strong>'
    },
    {
      kw: ['propuesta','generar propuesta','pdf propuesta','documento propuesta'],
      chips: ['¿Cómo genero un contrato?','¿Cómo asigno un proyecto a un candidato?','¿Cómo envío por WhatsApp?','¿Qué candidatos hay?'],
      html: '<strong>Generar una Propuesta</strong><br><br>La propuesta es un <strong>PDF premium</strong> con portada oscura que incluye:<br>• Resumen inversión y modelo elegido<br>• 3 escenarios: conservador / base / optimista<br>• KPIs: TIR, ROI, Payback, múltiplo de capital<br>• Proyección año a año<br>• Análisis de sensibilidad<br><br><strong>Pasos:</strong><br>1️⃣ Propuestas → sección <strong>Candidatos</strong><br>2️⃣ Abre la ficha del candidato<br>3️⃣ En el bloque de asignaciones → botón <strong>📄 Propuesta</strong><br>4️⃣ Envía por <strong>📧 email</strong> o <strong>💬 WhatsApp</strong>'
    },
    {
      kw: ['contrato','firma','documento legal','clausulas','contrato inversor','generar contrato'],
      chips: ['¿Cómo genero una propuesta?','¿Qué cláusulas incluye?','¿Puedo enviarlo por email?','¿Qué candidatos hay?'],
      html: '<strong>Generar un Contrato</strong><br><br>El contrato sigue formato notarial con <strong>11 cláusulas</strong>:<br><br>1. Objeto de la inversión<br>2. Importe y condiciones<br>3. Modelo de retorno (BNP / Revenue Share / Híbrido)<br>4. Calendario de pagos<br>5. Condiciones de salida y devolución de capital<br>6. Duración y prórroga<br>7. Garantías<br>8. Obligaciones del operador<br>9. Confidencialidad<br>10. Resolución de conflictos<br>11. Ley aplicable y jurisdicción<br><br>📍 <strong>Mismo proceso que la propuesta</strong> → botón <strong>📜 Contrato</strong>'
    },
    {
      kw: ['añadir inversor','nuevo inversor','agregar inversor','como pongo inversor','registrar inversor'],
      chips: ['¿Qué modelos de inversión hay?','¿Cómo hacer una liquidación?','¿Cuántos inversores puedo tener?','¿Cómo uso el simulador?'],
      html: '<strong>Añadir un Inversor</strong><br><br>1️⃣ Propuestas → <strong>Inversión Operativa</strong><br>2️⃣ Selecciona el proyecto<br>3️⃣ Tab <strong>👥 Inversores</strong><br>4️⃣ Botón <strong>"+ Añadir inversor"</strong><br><br><strong>Datos a rellenar:</strong><br>• Nombre del inversor<br>• Importe invertido (€)<br>• Modelo: BNP / Revenue Share / Híbrido<br>• % de retorno pactado<br>• Año de salida y prima<br><br>💡 Usa <strong>"💼 Pre-cargar desde simulador"</strong> para autocompletar con los datos del simulador activo.'
    },
    {
      kw: ['liquidacion','pago mensual','cobro mensual','distribucion','reparto','cuanto cobra','cuando se paga'],
      chips: ['¿Cómo añado un inversor?','¿Qué es el BNP Share?','¿Cómo marco un pago?','¿Qué es el simulador?'],
      html: '<strong>Liquidaciones</strong><br><br>Muestra el <strong>estado de pagos mensual por inversor</strong>.<br><br>Incluye:<br>• Importe mensual calculado automáticamente<br>• Total acumulado cobrado<br>• % del capital ya recuperado<br>• Estado: pendiente / pagado<br>• Exportación a PDF para registros<br><br>📍 <em>En la app:</em> Propuestas → Inversión Operativa → proyecto → tab <strong>💰 Liquidaciones</strong>'
    },
    {
      kw: ['catalogo','configuracion camara','guardar configuracion','nueva configuracion','crear configuracion','abrir catalogo'],
      chips: ['¿Cómo guardo una configuración?','¿Puedo tener varias cámaras?','¿Cuánto cuesta una cámara?','¿Qué complementos hay?'],
      html: '<strong>Catálogo de Cámaras</strong><br><br>El catálogo (<strong>catalogo.html</strong>) permite:<br><br>1️⃣ Explorar los <strong>11 modelos MacyPan</strong> con specs y precios<br>2️⃣ Seleccionar complementos wellness<br>3️⃣ Configurar logística (marítimo / aéreo / personalizado)<br>4️⃣ Ajustar parámetros operativos (horas/día, precio sesión...)<br>5️⃣ <strong>Guardar configuraciones con nombre</strong><br><br>Desde el catálogo → botón <strong>"✅ Usar en proyecto"</strong> → se carga automáticamente en la calculadora.<br><br>📍 Acceso: menú superior → <strong>📦 Catálogo</strong>'
    },
    {
      kw: ['varias camaras','multiples camaras','multi config','mas de una camara','dos camaras','varias configuraciones'],
      chips: ['¿Cómo añado una configuración?','¿Cómo se calcula el ROI conjunto?','¿Cómo abro el catálogo?','¿Cómo creo un proyecto?'],
      html: '<strong>Múltiples Cámaras en un Proyecto</strong><br><br>Sí, un proyecto puede tener <strong>varias configuraciones de cámara independientes</strong>, cada una con su propio:<br>• Modelo y precio<br>• Parámetros operativos (horas, sesiones, precio...)<br>• Perfil de ocupación mensual<br>• <strong>TIR, ROI y Payback calculados de forma independiente</strong><br><br><strong>Cómo añadir:</strong><br>1️⃣ index.html → sección Cámara<br>2️⃣ Define los parámetros<br>3️⃣ Clic en <strong>"+ Guardar config. actual"</strong><br>4️⃣ Repite para cada cámara<br><br>En propuestas.html verás las KPIs <strong>de cada cámara por separado</strong>.'
    },
    {
      kw: ['facturacion','ingresos','cuanto factura','cuanto se factura','ganancias estimadas','ingresos estimados','cuanto se gana'],
      chips: ['¿Qué precio de sesión poner?','¿Qué ocupación es realista?','¿Qué cámara da más ingresos?','¿Cómo ver las proyecciones?'],
      html: '<strong>Facturación Proyectada</strong><br><br><code style="background:#f0ebe5;padding:3px 6px;border-radius:4px;font-size:10px;">Plazas × Sesiones/día × Días/mes × Ocupación% × Precio sesión</code><br><br><strong>Ejemplo práctico</strong> — HE5000 Reg 1.9 (3P):<br>• 8h/día, sesiones 60 min → 8 sesiones/día<br>• 22 días/mes × 70% ocupación → 123 sesiones<br>• €85/sesión × 3 plazas → <strong style="color:#2e7d32;">~€31.365/mes</strong> bruto<br><br>📍 <em>En la app:</em> Calculadora → Operatividad → tab <strong>💶 Facturación</strong>'
    },
    {
      kw: ['precio sesion','cuanto cobrar','tarifa sesion','cuanto vale una sesion','precio por sesion'],
      chips: ['¿Cuántas sesiones al día?','¿Qué ocupación es realista?','¿Cómo calcular facturación?','¿Qué cámara elegir?'],
      html: '<strong>Precio de Sesión Recomendado</strong><br><br><table style="width:100%;border-collapse:collapse;font-size:11px;margin:8px 0;"><tr style="background:#f0ebe5;"><td style="padding:4px 6px;font-weight:700;">Tipo</td><td style="padding:4px 6px;font-weight:700;">Rango</td></tr><tr><td style="padding:4px 6px;">Wellness estándar (1,5ATA · 60min)</td><td style="padding:4px 6px;font-weight:700;">€60–80</td></tr><tr style="background:#f9f7f5;"><td style="padding:4px 6px;">Médico/deportivo (1,9ATA · 90min)</td><td style="padding:4px 6px;font-weight:700;">€80–120</td></tr><tr><td style="padding:4px 6px;">Experiencia premium + complementos</td><td style="padding:4px 6px;font-weight:700;">€100–150</td></tr><tr style="background:#f9f7f5;"><td style="padding:4px 6px;">Bono 10 sesiones (dto. ~15%)</td><td style="padding:4px 6px;font-weight:700;">× 0,85</td></tr></table>💡 Posicionamiento SoulBaric: <strong>premium wellness</strong>. Se recomienda <strong>€80–100/sesión</strong>.'
    },
    {
      kw: ['ocupacion','tasa ocupacion','realista','cuantos clientes','aforo cuanto'],
      chips: ['¿Cómo configuro la ocupación?','¿Qué es el período de carencia?','¿Cuánto factura al 70%?','¿Cómo ver las proyecciones?'],
      html: '<strong>Ocupación — ¿Qué es realista?</strong><br><br><table style="width:100%;border-collapse:collapse;font-size:11px;margin:8px 0;"><tr style="background:#f0ebe5;"><td style="padding:4px 6px;font-weight:700;">Período</td><td style="padding:4px 6px;font-weight:700;">Ocupación</td></tr><tr><td style="padding:4px 6px;">Meses 1–3 (carencia/rampa)</td><td style="padding:4px 6px;color:#c62828;font-weight:700;">0–20%</td></tr><tr style="background:#f9f7f5;"><td style="padding:4px 6px;">Meses 4–6</td><td style="padding:4px 6px;color:#ff9800;font-weight:700;">30–50%</td></tr><tr><td style="padding:4px 6px;">Meses 7–12</td><td style="padding:4px 6px;color:#e65100;font-weight:700;">50–70%</td></tr><tr style="background:#f9f7f5;"><td style="padding:4px 6px;">Año 2 en adelante</td><td style="padding:4px 6px;color:#2e7d32;font-weight:700;">70–85%</td></tr></table>📍 <em>En la app:</em> Calculadora → Operatividad → tab <strong>📅 Ocupación</strong>'
    },
    {
      kw: ['crear proyecto','nuevo proyecto','guardar proyecto','como creo un proyecto','como hago un proyecto'],
      chips: ['¿Cómo añado múltiples cámaras?','¿Cómo cargo del catálogo?','¿Cómo genero propuestas?','¿Cómo añado inversores?'],
      html: '<strong>Crear un Proyecto</strong><br><br><strong>Pasos en la Calculadora (index.html):</strong><br><br>1️⃣ <strong>Ficha CRM</strong> — nombre del centro, contacto, dirección<br>2️⃣ <strong>Cámara</strong> — selecciona modelo del catálogo o configura manualmente<br>3️⃣ <strong>Operatividad</strong> — horas, sesiones, precio de sesión<br>4️⃣ <strong>Ocupación</strong> — perfil mensual realista<br>5️⃣ <strong>Configuraciones</strong> — añade varias cámaras si es necesario<br>6️⃣ Clic en <strong>💾 GUARDAR PROYECTO</strong><br><br>El proyecto queda disponible en <strong>propuestas.html</strong> para inversores y propuestas.'
    },
    {
      kw: ['candidato','crm','lead','cliente potencial','prospecto','importar candidato','añadir candidato','gestion candidatos'],
      chips: ['¿Cómo genero una propuesta?','¿Cómo importo candidatos?','¿Qué es el perfil inversor?','¿Cómo asigno un proyecto?'],
      html: '<strong>Gestión de Candidatos (CRM)</strong><br><br>Los candidatos son <strong>inversores potenciales</strong> a los que asignas proyectos y generas documentos.<br><br><strong>Perfiles:</strong><br>• 🔵 <strong>Conservador</strong> — &lt;€30.000<br>• 🟡 <strong>Moderado</strong> — €30.000–€80.000<br>• 🔴 <strong>Agresivo</strong> — &gt;€80.000<br><br><strong>Acciones disponibles:</strong><br>✅ Añadir manualmente<br>📂 Importar CSV (nombre, email, inversion, perfil)<br>📤 Exportar CSV<br>📄 Propuesta · 📜 Contrato · 📧 Email · 💬 WhatsApp<br><br>📍 <em>En la app:</em> Propuestas → sección <strong>Candidatos</strong>'
    },
    {
      kw: ['logistica','transporte','envio','instalacion','coste logistica','flete','maritimo','aereo'],
      chips: ['¿Cuánto cuesta una cámara?','¿Qué complementos hay?','¿Cómo abro el catálogo?','¿Cómo creo una configuración?'],
      html: '<strong>Logística e Instalación</strong><br><br><table style="width:100%;border-collapse:collapse;font-size:11px;margin:8px 0;"><tr style="background:#f0ebe5;"><td style="padding:4px 6px;font-weight:700;">Tipo</td><td style="padding:4px 6px;font-weight:700;">Coste aprox.</td></tr><tr><td style="padding:4px 6px;">🚢 Marítimo (estándar)</td><td style="padding:4px 6px;font-weight:700;">€4.500</td></tr><tr style="background:#f9f7f5;"><td style="padding:4px 6px;">✈️ Aéreo (urgente)</td><td style="padding:4px 6px;font-weight:700;">€8.500</td></tr><tr><td style="padding:4px 6px;">🔧 Instalación y puesta en marcha</td><td style="padding:4px 6px;font-weight:700;">€7.000</td></tr><tr style="background:#f9f7f5;"><td style="padding:4px 6px;">📦 Paquete completo estándar</td><td style="padding:4px 6px;font-weight:700;color:#C89968;">€11.500</td></tr></table>Estos costes se incluyen en el cálculo de la inversión total.'
    },
    {
      kw: ['simulador','como uso el simulador','que es el simulador','donde esta el simulador'],
      chips: ['¿Qué es el TIR?','¿Qué es el ROI?','¿Qué modelos de inversión hay?','¿Cómo añado un inversor?'],
      html: '<strong>Simulador de Inversión</strong><br><br>El simulador calcula en tiempo real el <strong>TIR, ROI, Payback y proyección año a año</strong> para cualquier inversor.<br><br><strong>Parámetros configurables:</strong><br>• Modelo: BNP Share / Revenue Share / Híbrido<br>• Capital simulado (€)<br>• % de retorno<br>• Duración (años)<br>• Costes directos mensuales<br>• Crecimiento anual de ingresos<br>• Tipo de salida (multiplicador o importe fijo)<br>• Escenarios conservador / base / optimista<br><br>📍 <em>En la app:</em> Propuestas → Inversión Operativa → tab <strong>📊 Simulador</strong>'
    },
    {
      kw: ['hola','buenas','buenos dias','buenas tardes','buenas noches','hi','hey','saludos','que tal','como estas'],
      chips: ['¿Cuánto cuesta una cámara?','¿Qué rentabilidad puedo esperar?','¿Cómo genero una propuesta?','¿Cómo funciona el BNP Share?'],
      html: '¡Hola! 👋 Soy el <strong>Asistente SoulBaric</strong>.<br><br>Puedo ayudarte con:<br>💰 <strong>Inversión:</strong> TIR, ROI, Payback, modelos de retorno<br>🏥 <strong>Cámaras:</strong> modelos, precios, recomendaciones<br>📝 <strong>Propuestas y contratos</strong> para inversores<br>⚙️ <strong>Cómo usar</strong> cada módulo de la app<br><br>¿En qué te puedo ayudar?'
    },
    {
      kw: ['gracias','perfecto','genial','muy bien','excelente','entendido','ok','vale','de acuerdo','estupendo'],
      chips: ['¿Qué es el TIR?','¿Cuánto cuesta una cámara?','¿Cómo genero una propuesta?','¿Qué modelos de inversión hay?'],
      html: '¡De nada! 😊 Si tienes más dudas, aquí estoy. Puedes preguntarme sobre cámaras, inversión, propuestas o cualquier aspecto del negocio hiperbárico SoulBaric.'
    }
  ];

  var FALLBACK = {
    html: 'No estoy seguro de entender tu pregunta 🤔<br><br>Prueba con términos como: <strong>TIR, ROI, cámara, propuesta, inversor, carencia, catálogo, BNP, Revenue Share</strong>...<br><br>O selecciona una de las preguntas frecuentes.',
    chips: ['¿Cuánto cuesta una cámara?','¿Qué es el TIR?','¿Cómo genero una propuesta?','¿Qué es el BNP Share?']
  };

  function findIntent(input) {
    var n = norm(input);
    var best = null, bestScore = 0;
    INTENTS.forEach(function(intent) {
      var score = 0;
      intent.kw.forEach(function(kw) {
        if (n.indexOf(norm(kw)) !== -1) score += kw.split(' ').length;
      });
      if (score > bestScore) { bestScore = score; best = intent; }
    });
    return bestScore > 0 ? best : null;
  }

  function nowTime() {
    var d = new Date();
    return ('0'+d.getHours()).slice(-2) + ':' + ('0'+d.getMinutes()).slice(-2);
  }

  function renderMessages() {
    var area = document.getElementById('sb-messages');
    if (!area) return;
    area.innerHTML = sbHistory.map(function(m) {
      if (m.role === 'user') {
        return '<div style="display:flex;justify-content:flex-end;margin-bottom:12px;">' +
          '<div style="max-width:78%;">' +
          '<div style="background:#C89968;color:#fff;border-radius:14px 14px 3px 14px;padding:10px 13px;font-size:12px;line-height:1.5;">' + m.html + '</div>' +
          '<div style="font-size:9px;color:#bbb;text-align:right;margin-top:3px;">' + m.time + '</div>' +
          '</div></div>';
      } else {
        return '<div style="display:flex;gap:8px;margin-bottom:12px;align-items:flex-start;">' +
          '<div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#C89968,#8B6F47);display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;margin-top:2px;">🤖</div>' +
          '<div style="max-width:82%;">' +
          '<div style="background:#f0ebe5;color:#3d3530;border-radius:3px 14px 14px 14px;padding:10px 13px;font-size:12px;line-height:1.6;">' + m.html + '</div>' +
          '<div style="font-size:9px;color:#bbb;margin-top:3px;">' + m.time + '</div>' +
          '</div></div>';
      }
    }).join('');
    area.scrollTop = area.scrollHeight;
  }

  function renderChips(chips) {
    var el = document.getElementById('sb-chips');
    if (!el || !chips) return;
    el.innerHTML = chips.map(function(c) {
      return '<button onclick="window.sbChatSend(' + JSON.stringify(c) + ')" ' +
        'style="padding:5px 10px;border:1px solid rgba(200,153,104,0.5);border-radius:14px;' +
        'background:rgba(200,153,104,0.07);color:#8B6F47;font-size:10px;cursor:pointer;' +
        'white-space:nowrap;font-weight:600;margin-bottom:4px;">' + c + '</button>';
    }).join('');
  }

  function showTyping() {
    var area = document.getElementById('sb-messages');
    if (!area) return;
    var el = document.createElement('div');
    el.id = 'sb-typing';
    el.style.cssText = 'display:flex;gap:8px;margin-bottom:12px;align-items:flex-start;';
    el.innerHTML = '<div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#C89968,#8B6F47);display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;">🤖</div>' +
      '<div style="background:#f0ebe5;border-radius:3px 14px 14px 14px;padding:12px 16px;display:flex;gap:5px;align-items:center;">' +
      '<span style="width:7px;height:7px;background:#C89968;border-radius:50%;display:inline-block;animation:sbDot 1s infinite;"></span>' +
      '<span style="width:7px;height:7px;background:#C89968;border-radius:50%;display:inline-block;animation:sbDot 1s infinite .2s;"></span>' +
      '<span style="width:7px;height:7px;background:#C89968;border-radius:50%;display:inline-block;animation:sbDot 1s infinite .4s;"></span>' +
      '</div>';
    area.appendChild(el);
    area.scrollTop = area.scrollHeight;
  }

  function hideTyping() {
    var el = document.getElementById('sb-typing');
    if (el) el.remove();
  }

  window.sbChatSend = function(text) {
    if (!text || !text.trim()) return;
    var input = document.getElementById('sb-input');
    sbHistory.push({ role: 'user', html: text.replace(/</g,'&lt;').replace(/>/g,'&gt;'), time: nowTime() });
    renderMessages();
    if (input) input.value = '';
    var chips = document.getElementById('sb-chips');
    if (chips) chips.innerHTML = '';
    showTyping();
    setTimeout(function() {
      hideTyping();
      var intent = findIntent(text);
      var resp = intent || FALLBACK;
      sbHistory.push({ role: 'bot', html: resp.html, time: nowTime() });
      renderMessages();
      renderChips(resp.chips);
    }, 650);
  };

  window.sbToggleChat = function() {
    sbOpen = !sbOpen;
    var panel = document.getElementById('sb-chat-panel');
    var btn   = document.getElementById('sb-chat-btn');
    var badge = document.getElementById('sb-badge');
    if (!panel) return;
    panel.style.display = sbOpen ? 'flex' : 'none';
    btn.innerHTML = sbOpen
      ? '<span style="font-size:20px;line-height:1;color:#fff;">✕</span>'
      : '<span style="font-size:22px;line-height:1;">🤖</span>';
    if (badge) badge.style.display = 'none';
    if (sbOpen && sbFirstOpen) {
      sbFirstOpen = false;
      setTimeout(function() {
        sbHistory.push({
          role: 'bot',
          html: '¡Hola! Soy el <strong>Asistente SoulBaric</strong> 👋<br><br>' +
            'Puedo ayudarte con:<br>' +
            '💰 <strong>Inversión:</strong> TIR, ROI, Payback, modelos de retorno<br>' +
            '🏥 <strong>Cámaras:</strong> modelos, precios, recomendaciones<br>' +
            '📝 <strong>Propuestas y contratos</strong> para inversores<br>' +
            '⚙️ <strong>Cómo usar</strong> cada módulo de la app<br><br>' +
            '¿En qué te puedo ayudar?',
          time: nowTime()
        });
        renderMessages();
        renderChips(['¿Cuánto cuesta una cámara?','¿Qué rentabilidad puedo esperar?','¿Cómo genero una propuesta?','¿Cómo funciona el BNP Share?']);
      }, 400);
    }
  };

  function injectCSS() {
    if (document.getElementById('sb-chat-css')) return;
    var s = document.createElement('style');
    s.id = 'sb-chat-css';
    s.textContent = '@keyframes sbDot{0%,80%,100%{transform:scale(.55);opacity:.35}40%{transform:scale(1);opacity:1}}' +
      '@keyframes sbSlideUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}' +
      '#sb-chat-panel{animation:sbSlideUp .22s ease;}' +
      '#sb-input:focus{outline:none;border-color:#C89968!important;}' +
      '#sb-chips button:hover{background:rgba(200,153,104,0.18)!important;}';
    document.head.appendChild(s);
  }

  function injectHTML() {
    injectCSS();

    // Botón flotante
    var btn = document.createElement('div');
    // Detectar si existe el botón de propuestas para evitar solapamiento
    var hasPropsBtn = !!document.getElementById('asistente-btn');
    var btnRight = hasPropsBtn ? '88px' : '24px';
    var panelRight = hasPropsBtn ? '88px' : '24px';

    btn.id = 'sb-chat-btn';
    btn.setAttribute('onclick', 'window.sbToggleChat()');
    btn.title = 'Asistente IA SoulBaric';
    btn.style.cssText = 'position:fixed;bottom:24px;right:' + btnRight + ';z-index:10000;width:54px;height:54px;border-radius:50%;' +
      'background:linear-gradient(135deg,#C89968,#8B6F47);display:flex;align-items:center;justify-content:center;' +
      'cursor:pointer;box-shadow:0 4px 22px rgba(200,153,104,.55);transition:transform .2s ease;';
    btn.innerHTML = '<span style="font-size:22px;line-height:1;">🤖</span>' +
      '<div id="sb-badge" style="position:absolute;top:-3px;right:-3px;width:18px;height:18px;border-radius:50%;' +
      'background:#f44336;color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;' +
      'justify-content:center;border:2px solid #fff;">1</div>';
    btn.onmouseover = function() { this.style.transform = 'scale(1.1)'; };
    btn.onmouseout  = function() { this.style.transform = 'scale(1)'; };
    document.body.appendChild(btn);

    // Panel
    var panel = document.createElement('div');
    panel.id = 'sb-chat-panel';
    panel.style.cssText = 'position:fixed;bottom:90px;right:' + panelRight + ';z-index:9999;width:380px;max-height:78vh;min-height:380px;' +
      'background:#fff;border-radius:16px;box-shadow:0 12px 50px rgba(0,0,0,.22);' +
      'border:1px solid #e8e4df;display:none;flex-direction:column;overflow:hidden;';

    panel.innerHTML =
      '<div style="background:linear-gradient(135deg,#1a1a1a,#2d2d2d);padding:14px 16px;flex-shrink:0;display:flex;align-items:center;justify-content:space-between;">' +
        '<div style="display:flex;align-items:center;gap:10px;">' +
          '<div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#C89968,#8B6F47);display:flex;align-items:center;justify-content:center;font-size:18px;">🤖</div>' +
          '<div>' +
            '<div style="font-size:13px;font-weight:700;color:#fff;">Asistente SoulBaric</div>' +
            '<div style="font-size:10px;color:rgba(255,255,255,.5);display:flex;align-items:center;gap:5px;">' +
              '<span style="width:7px;height:7px;border-radius:50%;background:#4caf50;display:inline-block;"></span>' +
              'IA · Siempre disponible' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<button onclick="window.sbToggleChat()" style="background:none;border:none;color:rgba(255,255,255,.5);cursor:pointer;font-size:18px;line-height:1;padding:4px;">✕</button>' +
      '</div>' +
      '<div id="sb-messages" style="flex:1;overflow-y:auto;padding:14px;background:#faf8f6;display:flex;flex-direction:column;min-height:0;"></div>' +
      '<div id="sb-chips" style="padding:8px 12px 4px;display:flex;gap:6px;flex-wrap:wrap;background:#faf8f6;max-height:76px;overflow:hidden;flex-shrink:0;border-top:1px solid #f0ebe5;"></div>' +
      '<div style="padding:10px 12px;border-top:1px solid #e8e4df;background:#fff;display:flex;gap:8px;align-items:center;flex-shrink:0;">' +
        '<input id="sb-input" type="text" placeholder="Escribe tu pregunta..." ' +
          'style="flex:1;padding:9px 13px;border:1.5px solid #e8e4df;border-radius:22px;font-size:12px;color:#3d3530;" ' +
          'onkeydown="if(event.key===\'Enter\'){window.sbChatSend(this.value);}">' +
        '<button onclick="window.sbChatSend(document.getElementById(\'sb-input\').value)" ' +
          'style="width:38px;height:38px;border-radius:50%;border:none;background:linear-gradient(135deg,#C89968,#8B6F47);color:#fff;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;">➤</button>' +
      '</div>' +
      '<div style="padding:6px 14px;border-top:1px solid #f0ebe5;background:#fff;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;">' +
        '<span style="font-size:9px;color:#bbb;">SoulBaric · Asistente IA</span>' +
        '<a href="manual.html" target="_blank" style="font-size:10px;color:#C89968;font-weight:700;text-decoration:none;">Manual completo →</a>' +
      '</div>';

    document.body.appendChild(panel);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectHTML);
  } else {
    injectHTML();
  }
})();
