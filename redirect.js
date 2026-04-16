import { supabase } from './supabase-client.js';

export default async function handler(req, res) {
    const { affiliate, link } = req.query;

    const { data: linkData, error } = await supabase
        .from('affiliate_links')
        .select('destination_url, affiliate_id')
        .eq('custom_slug', link)
        .single();

    if (error || !linkData) return res.status(404).send('Link non valido');

    const { data: click, error: clickError } = await supabase
        .from('clicks')
        .insert([{
            affiliate_id: linkData.affiliate_id,
            ip_address: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
            user_agent: req.headers['user-agent'],
            referrer: req.headers.referer
        }])
        .select()
        .single();

    if (!clickError) {
        res.setHeader('Set-Cookie', `affiliate_click_id=${click.id}; Path=/; Max-Age=2592000; HttpOnly; Secure; SameSite=Lax`);
    }

    res.redirect(302, linkData.destination_url);
}