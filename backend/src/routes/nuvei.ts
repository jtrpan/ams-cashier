import { Router } from 'express';
import { initiatePayment } from '../services/nuveiService';

const router = Router();

router.post('/checkout', async (req, res) => {
    try {
        const result = await initiatePayment(req.body);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Payment initiation failed' });
    }
});

export default router;
