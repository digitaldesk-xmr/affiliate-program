import { supabase } from './supabase-client.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { access_token, new_password } = req.body;
    if (!access_token || !new_password) {
        return res.status(400).json({ error: 'Token e nuova password richiesti' });
    }

    const { error } = await supabase.auth.updateUser({ password: new_password });
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
}
