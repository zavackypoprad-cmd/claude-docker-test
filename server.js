const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = 3000;

// PostgreSQL connection pool
const pool = new Pool({
  user: 'testuser',
  host: 'localhost',
  database: 'testdb',
  password: 'testpass',
  port: 5432,
});

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'claude-docker-test'
  });
});

// Database test endpoint
app.get('/api/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as current_time, version() as pg_version');
    res.json({
      status: 'success',
      message: 'Database connection successful',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Database test: http://localhost:${PORT}/api/test`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  pool.end();
  process.exit(0);
});
