/**
 * confirmDelete — Sistema de seguridad de 2 pasos para eliminar elementos
 * Uso: confirmDelete('Nombre del elemento', () => { /* lógica de borrado *\/ })
 */
function confirmDelete(itemLabel, onConfirm) {
  // Evitar duplicados
  const existing = document.getElementById('cdd-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'cdd-overlay';
  overlay.style.cssText = [
    'position:fixed', 'top:0', 'left:0', 'width:100%', 'height:100%',
    'background:rgba(0,0,0,0.65)', 'z-index:999999',
    'display:flex', 'align-items:center', 'justify-content:center'
  ].join(';');

  function close() { overlay.remove(); }

  function step1() {
    overlay.innerHTML = `
      <div style="background:#fff;border-radius:14px;padding:36px 32px;width:430px;max-width:92vw;
                  box-shadow:0 24px 60px rgba(0,0,0,0.35);text-align:center;
                  border-top:5px solid #f59e0b;animation:cddIn 0.18s ease;">
        <div style="font-size:52px;margin-bottom:14px;">⚠️</div>
        <h3 style="font-size:19px;font-weight:700;color:#1a1a1a;margin-bottom:10px;">¿Estás seguro?</h3>
        <p style="font-size:13px;color:#555;line-height:1.6;margin-bottom:26px;">
          Estás a punto de eliminar<br>
          <strong style="color:#1a1a1a;font-size:14px;">"${itemLabel}"</strong>
        </p>
        <div style="display:flex;gap:10px;justify-content:center;">
          <button id="cdd-cancel1"
            style="background:#f5f5f5;color:#555;border:1px solid #ddd;padding:11px 26px;
                   border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;">
            Cancelar
          </button>
          <button id="cdd-next"
            style="background:linear-gradient(135deg,#f59e0b,#fbbf24);color:#fff;border:none;
                   padding:11px 26px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:700;">
            Sí, continuar →
          </button>
        </div>
      </div>`;
    overlay.querySelector('#cdd-cancel1').onclick = close;
    overlay.querySelector('#cdd-next').onclick = step2;
  }

  function step2() {
    overlay.innerHTML = `
      <div style="background:#fff;border-radius:14px;padding:36px 32px;width:430px;max-width:92vw;
                  box-shadow:0 24px 60px rgba(0,0,0,0.35);text-align:center;
                  border-top:5px solid #dc2626;animation:cddIn 0.18s ease;">
        <div style="font-size:52px;margin-bottom:14px;">🗑️</div>
        <h3 style="font-size:19px;font-weight:700;color:#dc2626;margin-bottom:8px;">Vamos a eliminar</h3>
        <p style="font-size:14px;color:#1a1a1a;font-weight:600;margin-bottom:6px;">
          "${itemLabel}"
        </p>
        <p style="font-size:12px;color:#999;margin-bottom:28px;">
          Esta acción es permanente y no se puede deshacer.
        </p>
        <div style="display:flex;gap:10px;justify-content:center;">
          <button id="cdd-cancel2"
            style="background:#f5f5f5;color:#555;border:1px solid #ddd;padding:11px 26px;
                   border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;">
            Cancelar
          </button>
          <button id="cdd-confirm"
            style="background:linear-gradient(135deg,#dc2626,#ef4444);color:#fff;border:none;
                   padding:11px 30px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:700;
                   letter-spacing:0.3px;">
            🗑 Eliminar definitivamente
          </button>
        </div>
      </div>`;
    overlay.querySelector('#cdd-cancel2').onclick = close;
    overlay.querySelector('#cdd-confirm').onclick = () => { close(); onConfirm(); };
  }

  // Cerrar al hacer click fuera
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

  // Animación CSS
  if (!document.getElementById('cdd-style')) {
    const style = document.createElement('style');
    style.id = 'cdd-style';
    style.textContent = `@keyframes cddIn { from { opacity:0; transform:scale(0.92) translateY(-10px); } to { opacity:1; transform:scale(1) translateY(0); } }`;
    document.head.appendChild(style);
  }

  step1();
  document.body.appendChild(overlay);
}
