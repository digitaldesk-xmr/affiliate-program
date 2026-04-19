class AffiliateTracker {
    constructor() {
        this.trackingEndpoint = window.location.origin + '/api/track-click';
        this.init();
    }
    init() {
        document.querySelectorAll('a[href*="/go/"]').forEach(link => {
            link.addEventListener('click', (e) => this.trackClick(link.href));
        });
    }
    async trackClick(destinationUrl) {
        const match = destinationUrl.match(/\/go\/([^\/]+)\/([^\/]+)/);
        if (match) {
            const [, affiliateCode, linkCode] = match;
            fetch(this.trackingEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ affiliateCode, linkCode, referrer: document.referrer, userAgent: navigator.userAgent }),
                keepalive: true
            });
        }
    }
}
new AffiliateTracker();