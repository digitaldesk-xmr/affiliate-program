import { supabase } from './supabase-client.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== process.env.ADMIN_API_KEY) return res.status(401).json({ error: 'Unauthorized' });

    const { affiliateId, conversionIds, amount, crypto_currency, crypto_amount, method } = req.body;
    if (!affiliateId || !conversionIds || !amount) return res.status(400).json({ error: 'Missing fields' });

    const { error: payError } = await supabase
        .from('payments')
        .insert([{
            affiliate_id: affiliateId,
            amount: amount,
            crypto_currency: crypto_currency || null,
            crypto_amount: crypto_amount || null,
            conversion_ids: conversionIds,
            payment_method: method || 'crypto',
            status: 'paid',
            paid_at: new Date()
        }]);

    if (payError) return res.status(500).json({ error: payError.message });

    const { error: updateConvError } = await supabase
        .from('conversions')
        .update({ status: 'paid' })
        .in('id', conversionIds);

    if (updateConvError) return res.status(500).json({ error: updateConvError.message });

    const { data: affiliate } = await supabase
        .from('affiliates')
        .select('paid_earnings')
        .eq('id', affiliateId)
        .single();
    const newPaid = (affiliate.paid_earnings || 0) + amount;
    await supabase.from('affiliates').update({ paid_earnings: newPaid }).eq('id', affiliateId);

    res.json({ success: true });
}