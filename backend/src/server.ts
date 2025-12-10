// backend/src/server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import db from './config/database';
import cartRoutes from './routes/cartRoutes';
import checkoutRoutes from './routes/checkoutRoutes';
import authRoutes from './routes/authRoutes';
import movieRoutes from './routes/movieRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ===========================
// MIDDLEWARES
// ===========================

// CORS - Permitir requisições do frontend
app.use(cors({
    origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Logging middleware (desenvolvimento)
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });
}

// ===========================
// SERVIR ARQUIVOS ESTÁTICOS
// ===========================

// Diretório do frontend (ajuste o caminho conforme sua estrutura)
const frontendPath = path.join(__dirname, '../../frontend/src');

// Servir arquivos estáticos (CSS, JS, imagens)
app.use(express.static(frontendPath));

// ===========================
// ROTAS DA API
// ===========================

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Test database connection
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

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);

// ===========================
// SERVIR PÁGINAS HTML
// ===========================

app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'inicio.html'));
});

app.get('/catalogo', (req, res) => {
    res.sendFile(path.join(frontendPath, 'catalogo.html'));
});

app.get('/carrinho', (req, res) => {
    res.sendFile(path.join(frontendPath, 'carrinho.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(frontendPath, 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(frontendPath, 'register.html'));
});

app.get('/checkout', (req, res) => {
    res.sendFile(path.join(frontendPath, 'checkout.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(frontendPath, 'admin.html'));
});

// ===========================
// ERROR HANDLING
// ===========================

// 404 handler para rotas da API
app.use('/api/*', (req, res) => {
    res.status(404).json({ 
        error: 'Rota da API não encontrada',
        path: req.path 
    });
});

// 404 handler geral - qualquer outra rota serve o inicio.html (SPA behavior)
app.use('*', (req, res) => {
    // Se for uma requisição de arquivo estático que não existe
    if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico)$/)) {
        res.status(404).send('Arquivo não encontrado');
    } else {
        // Caso contrário, serve a página inicial (permite navegação SPA)
        res.sendFile(path.join(frontendPath, 'inicio.html'));
    }
});

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('❌ Error:', err.stack);
    res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ===========================
// INICIALIZAR SERVIDOR
// ===========================

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received. Closing server...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 SIGINT received. Closing server...');
    process.exit(0);
});

// Start server
app.listen(PORT, () => {
    console.log('');
    console.log('🎬 ========================================');
    console.log('🎬  CineCasa - Cinema Store Backend');
    console.log('🎬 ========================================');
    console.log(`🚀 Server running on: http://localhost:${PORT}`);
    console.log(`📁 Frontend path: ${frontendPath}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('');
    console.log('📍 Rotas disponíveis:');
    console.log('   - Frontend: http://localhost:' + PORT);
    console.log('   - API: http://localhost:' + PORT + '/api');
    console.log('   - Health: http://localhost:' + PORT + '/api/health');
    console.log('   - Test DB: http://localhost:' + PORT + '/api/test-db');
    console.log('');
    console.log('🎯 Páginas:');
    console.log('   - Início: http://localhost:' + PORT);
    console.log('   - Catálogo: http://localhost:' + PORT + '/catalogo');
    console.log('   - Carrinho: http://localhost:' + PORT + '/carrinho');
    console.log('   - Login: http://localhost:' + PORT + '/login');
    console.log('🎬 ========================================');
    console.log('');
});

export default app;