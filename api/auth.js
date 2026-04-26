// public/js/auth.js
// Gestione autenticazione Supabase per il programma di affiliazione

const SUPABASE_URL = 'https://il-tuo-progetto.supabase.co';
const SUPABASE_ANON_KEY = 'la-tua-chiave-anon';

// Inizializza il client Supabase
const supabase = window.supabase?.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper per ottenere il token di sessione
async function getSessionToken() {
    if (!supabase) return null;
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) return null;
    return session.access_token;
}

// Helper per verificare se l'utente è loggato
async function isAuthenticated() {
    if (!supabase) return false;
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
}

// Helper per ottenere l'utente corrente
async function getCurrentUser() {
    if (!supabase) return null;
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user;
}

// Logout
async function logout() {
    if (!supabase) return;
    await supabase.auth.signOut();
    localStorage.removeItem('affiliate_session');
    window.location.href = 'login.html';
}

// Reindirizza se non loggato
async function requireAuth() {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Reindirizza se loggato (per login/register)
async function requireGuest() {
    const authenticated = await isAuthenticated();
    if (authenticated) {
        window.location.href = 'affiliate-dashboard.html';
        return false;
    }
    return true;
}
