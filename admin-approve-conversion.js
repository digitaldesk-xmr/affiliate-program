import { supabase } from './supabase-client.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== process.env.ADMIN_API_KEY) return res.status(401).json({ error: 'Unauthorized' });

    const { conversionId, affiliateId, commission } = req.body;
    if (!conversionId || !affiliateId) return res.status(400).json({ error: 'Missing fields' });

    const { error: updateError } = await supabase
        .from('conversions')
        .update({ status: 'approved' })
        .eq('id', conversionId);

    if (updateError) return res.status(500).json({ error: updateError.message });

    await supabase.rpc('add_earnings', { aff_id: affiliateId, amount_to_add: commission });

    res.json({ success: true });
}