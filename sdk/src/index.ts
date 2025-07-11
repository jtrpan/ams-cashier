// index.ts
interface CheckoutOptions {
    gatewayUrl: string;
    amount: number;
    currency: string;
    returnUrl: string;
    clientRequestId?: string;
    mount: string;
    label?: string;
}

declare global {
    interface Window { AntarioPay: any; }
}

export function init(options: CheckoutOptions) {
    const btn = document.createElement('button');
    btn.textContent = options.label || 'Pay Now';
    btn.onclick = async () => {
        const res = await fetch(`${options.gatewayUrl}/api/nuvei/checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                clientRequestId: options.clientRequestId || Date.now().toString(),
                amount: options.amount,
                currency: options.currency,
                returnUrl: options.returnUrl
            })
        });
        const data = await res.json();
        if (data.redirectUrl) window.location.href = data.redirectUrl;
        else console.error(data);
    };
    document.querySelector(options.mount)?.appendChild(btn);
}

window.AntarioPay = { init };
