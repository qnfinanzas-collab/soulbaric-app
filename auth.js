/* ═══════════════════════════════════════════════
   SOULBARIC — Sistema de Autenticación
   auth.js — incluir en todas las páginas protegidas
═══════════════════════════════════════════════ */

const SB_AUTH = (() => {

  const SESSION_KEY = 'sb_session';
  const SALT        = 'soulbaric_salt_2026';
  const SESSION_TTL = 8 * 60 * 60 * 1000; // 8 horas

  // ── Usuarios y hashes de contraseña (SHA-256 + salt) ──
  const USERS = {
    'admin':   '884f1c8d9d919298ec347e8a9124eb9a026b9f56fc7332296ed1c3e08a63466c',
    'antonio': '8e5cce962a798dbd22098e8d69eac66da8a503baf94e261464c61bf71ced963a'
  };

  // ── Hash SHA-256 async (WebCrypto API) ──
  async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data    = encoder.encode(password + SALT);
    const buffer  = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // ── Login: verifica credenciales y crea sesión ──
  async function login(username, password) {
    const user = username.toLowerCase().trim();
    if (!USERS[user]) return false;
    const hash = await hashPassword(password);
    if (USERS[user] !== hash) return false;
    const session = {
      user,
      expires: Date.now() + SESSION_TTL
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return true;
  }

  // ── Verificación sincrónica de sesión ──
  function isAuthenticated() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return false;
      const session = JSON.parse(raw);
      if (!session?.user || Date.now() > session.expires) {
        sessionStorage.removeItem(SESSION_KEY);
        return false;
      }
      return true;
    } catch { return false; }
  }

  // ── Guard: redirige a login si no hay sesión ──
  function requireAuth() {
    if (!isAuthenticated()) {
      const current = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.replace('/login.html?redirect=' + current);
    }
  }

  // ── Logout ──
  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.replace('/login.html');
  }

  // ── Usuario actual ──
  function getCurrentUser() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      return JSON.parse(raw)?.user || null;
    } catch { return null; }
  }

  return { login, isAuthenticated, requireAuth, logout, getCurrentUser };
})();
