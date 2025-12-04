// backend/src/server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/database';

import authRoutes from './routes/authRoutes';
import movieRoutes from './routes/movieRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());


app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'Server is healthy',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/test-db', (req, res) => {
    try {
        const result = db.prepare('SELECT COUNT(*) as total FROM filmes').get() as { total: number };
        res.status(200).json({ 
            status: 'OK', 
            message: 'Database connected',
            totalMovies: result.total
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'ERROR', 
            message: 'Database connection failed',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

app.use('*', (req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});


app.listen(PORT, () => {
    console.log(`   Server running on port ${PORT}`);
});