import axios from 'axios';
import crypto from 'crypto';
import qs from 'qs';

const BASE = process.env.NUVEI_ENVIRONMENT === 'sandbox'
    ? 'https://sandbox.safecharge.com/ppp/api/v1'
    : 'https://api.safecharge.com/ppp/api/v1';

function signPayload(payload: any) {
    // Nuvei requires a hash of certain fields; adapt per their docs.
    const data = Object.keys(payload)
        .sort()
        .map(k => `${k}=${payload[k]}`)
        .join('');
    return crypto
        .createHmac(process.env.NUVEI_HASH_TYPE!, process.env.NUVEI_SECRET_KEY!)
        .update(data)
        .digest('hex');
}

export async function initiatePayment(params: any) {
    const payload = {
        merchantId: process.env.NUVEI_MERCHANT_ID,
        merchantSiteId: process.env.NUVEI_SITE_ID,
        clientRequestId: params.clientRequestId,
        amount: params.amount,
        currency: params.currency,
        returnUrl: params.returnUrl,
        ...params.extraFields,
    };
    payload['hash'] = signPayload(payload);

    const { data } = await axios.post(
        `${BASE}/initPayment`,
        qs.stringify(payload),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    return data;
}
