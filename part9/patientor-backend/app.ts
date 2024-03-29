import { config } from 'dotenv';
import express from 'express';
import cors from 'cors';
import diagnosesRouter from './routers/diagnosesRouter';
import patientsRouter from './routers/patientsRouter';

config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/ping', (_req, res) => {
 res.send('pong');
});

app.use('/api/diagnoses', diagnosesRouter)
app.use('/api/patients', patientsRouter)

app.listen(process.env.PORT, () => {
 console.log(`Server running on port ${process.env.PORT}`);
});