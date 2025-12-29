const express = require('express');
const cors = require('cors');
require('dotenv').config();

const datosRoutes = require('./routes/datos');

const app = express();
const PORT = process.env.PORT || 3001;

// Lista de orígenes permitidos
const allowedOrigins = [
  'http://localhost:5173',  // Desarrollo local
  process.env.FRONTEND_URL  // Producción (lo configuraremos después)
].filter(Boolean); // Eliminar valores undefined

// CORS configurado
app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin origin (como Postman, curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log de requests (solo en desarrollo)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: '✓ API de sincronización funcionando',
    version: '1.0.0',
    database: 'Supabase (PostgreSQL)',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rutas de la API
app.use('/api/datos', datosRoutes);

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint no encontrado',
    path: req.path
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    success: false, 
    error: process.env.NODE_ENV === 'production' 
      ? 'Error del servidor' 
      : err.message
  });
});

// Iniciar servidor en todas las interfaces (importante para Render)
app.listen(PORT, '0.0.0.0', () => {
  console.log('='.repeat(50));
  console.log(`✓ Servidor escuchando en puerto ${PORT}`);
  console.log(`✓ Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log('='.repeat(50));
});

