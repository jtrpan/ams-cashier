// app.ts
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import nuveiRouter from './routes/nuvei';

dotenv.config();
const app = express();
app.use(cors(), bodyParser.json());

app.use('/api/nuvei', nuveiRouter);

app.listen(process.env.PORT, () =>
    console.log(`API Gateway listening on port ${process.env.PORT}`)
);
