import { supabase } from './supabase-client.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email richiesta' });

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${req.headers.origin}/reset-password.html`,
    });

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
}