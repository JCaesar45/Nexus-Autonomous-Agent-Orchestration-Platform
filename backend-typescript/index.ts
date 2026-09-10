import express, { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const app = express();
app.use(express.json());

const requestSchema = z.object({
    session_id: z.string().uuid(),
    user_input: z.string().min(1).max(2000)
});

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const validation = requestSchema.safeParse(req.body);
    if (!validation.success) {
        res.status(400).json({ error: "Invalid payload structure", details: validation.error.errors });
        return;
    }
    next();
};

app.post('/api/v1/gateway/agent', validateRequest, (req: Request, res: Response) => {
    res.status(202).json({ status: "queued", transaction_id: crypto.randomUUID() });
});

app.listen(3000, () => console.log('Gateway active on port 3000'));
