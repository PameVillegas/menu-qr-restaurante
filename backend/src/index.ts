import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { config } from './utils/config.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import apiRoutes from './routes/index.js';
import pool from './utils/db.js';
import { runMigrations } from './migrations/migrate.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: config.cors.origin, credentials: true }));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.use('/api', apiRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

async function start() {
  console.log('Running database migrations...');
  await runMigrations();
  console.log('Migrations complete. Starting server...');
  
  // Seed tables if they don't exist
  const { seedTables } = await import('./utils/seed.js');
  await seedTables();
  
  app.listen(config.port, () => {
    console.log(`🚀 Server running on port ${config.port}`);
    console.log(`📝 Environment: ${config.nodeEnv}`);
    console.log(`🌐 CORS origin: ${config.cors.origin}`);
    console.log(`💾 Database: PostgreSQL`);
  });
}

process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  await pool.end();
  process.exit(0);
});

start();

export default app;