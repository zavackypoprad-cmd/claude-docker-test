const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

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
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

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

// ==================== TODO API ENDPOINTS ====================

// GET /api/todos - Get all todos
app.get('/api/todos', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM todos ORDER BY created_at DESC'
    );
    res.json({
      status: 'success',
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch todos',
      error: error.message
    });
  }
});

// POST /api/todos - Create new todo
app.post('/api/todos', async (req, res) => {
  try {
    const { title } = req.body;

    // Validation
    if (!title || title.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'Title is required and cannot be empty'
      });
    }

    if (title.length > 255) {
      return res.status(400).json({
        status: 'error',
        message: 'Title cannot exceed 255 characters'
      });
    }

    const result = await pool.query(
      'INSERT INTO todos (title) VALUES ($1) RETURNING *',
      [title.trim()]
    );

    res.status(201).json({
      status: 'success',
      message: 'Todo created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create todo',
      error: error.message
    });
  }
});

// PATCH /api/todos/:id - Toggle completed status
app.patch('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validation
    if (isNaN(id) || parseInt(id) <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid todo ID'
      });
    }

    // Toggle completed status
    const result = await pool.query(
      'UPDATE todos SET completed = NOT completed WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Todo not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Todo updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update todo',
      error: error.message
    });
  }
});

// DELETE /api/todos/:id - Delete todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validation
    if (isNaN(id) || parseInt(id) <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid todo ID'
      });
    }

    const result = await pool.query(
      'DELETE FROM todos WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Todo not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Todo deleted successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete todo',
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Database test: http://localhost:${PORT}/api/test`);
  console.log(`Todo App: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  pool.end();
  process.exit(0);
});
