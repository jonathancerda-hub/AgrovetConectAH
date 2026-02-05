import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { query as dbQuery } from './db.js';

// Rutas
import authRoutes from './routes/auth.routes.js';
import publicacionesRoutes from './routes/publicaciones.routes.js';
// import notificacionesRoutes from './routes/notificaciones.routes.js'; // Tabla no existe en Supabase
import empleadosRoutes from './routes/empleados.routes.js';
import vacacionesRoutes from './routes/vacaciones.routes.js';
import aprobacionRoutes from './routes/aprobacion.routes.js';

// Configuración
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Rate Limiters - Protección contra ataques
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 peticiones por IP
  message: { error: 'Demasiadas peticiones, intenta de nuevo más tarde' },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos de login
  message: { error: 'Demasiados intentos de login. Espera 15 minutos.' },
  skipSuccessfulRequests: true, // Solo cuenta los intentos fallidos
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 30, // máximo 30 peticiones por minuto
  message: { error: 'Límite de peticiones excedido. Espera un momento.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
// Aumentar el límite de tamaño del body para soportar imágenes base64
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Aplicar rate limiting
app.use('/api/', generalLimiter); // Limiter general para todas las rutas API

// Logger de requests (desarrollo)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Health check
app.get('/health', async (req, res) => {
  try {
    await dbQuery('SELECT 1');
    res.json({ 
      status: 'ok', 
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      database: 'disconnected',
      error: error.message 
    });
  }
});

// Rutas API
app.use('/api/auth', authLimiter, authRoutes); // Rate limit estricto para auth
app.use('/api/publicaciones', apiLimiter, publicacionesRoutes);
// app.use('/api/notificaciones', notificacionesRoutes); // Tabla no existe en Supabase
app.use('/api/empleados', apiLimiter, empleadosRoutes);
app.use('/api/vacaciones', apiLimiter, vacacionesRoutes);
app.use('/api/aprobacion', apiLimiter, aprobacionRoutes);

// Importar rutas de feriados
import feriadosRoutes from './routes/feriados.routes.js';
app.use('/api/feriados', apiLimiter, feriadosRoutes);

// Ruta 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Error handler global
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════╗
║   🚀 AGROVET CONECTA API                 ║
║   ✅ Servidor corriendo en puerto ${PORT}   ║
║   📡 Database: PostgreSQL (Render)       ║
║   🌐 CORS: ${process.env.CORS_ORIGIN || 'http://localhost:5174'}
║   📁 Docs: http://localhost:${PORT}/health    ║
╚══════════════════════════════════════════╝
  `);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

export default app;
