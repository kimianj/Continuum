import { Router } from 'express';
import db from '../db/index.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// All routes require authentication and admin privileges
router.use(authenticate);
router.use(requireAdmin);

// Get all notes from all users (read-only)
router.get('/notes', (req, res) => {
  try {
    const notes = db.prepare(`
      SELECT 
        notes.id,
        notes.title,
        notes.content,
        notes.created_at,
        notes.updated_at,
        users.id as user_id,
        users.name as user_name,
        users.email as user_email
      FROM notes
      JOIN users ON notes.user_id = users.id
      ORDER BY notes.updated_at DESC
    `).all();

    res.json(notes);
  } catch (error) {
    console.error('Admin get notes error:', error);
    res.status(500).json({ error: 'Failed to fetch notes.' });
  }
});

// Get all users (for admin dashboard)
router.get('/users', (req, res) => {
  try {
    const users = db.prepare(`
      SELECT 
        users.id,
        users.email,
        users.name,
        users.is_admin,
        users.created_at,
        COUNT(notes.id) as note_count
      FROM users
      LEFT JOIN notes ON users.id = notes.user_id
      GROUP BY users.id
      ORDER BY users.created_at DESC
    `).all();

    res.json(users.map(u => ({ ...u, isAdmin: !!u.is_admin })));
  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

// Get stats for dashboard
router.get('/stats', (req, res) => {
  try {
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const noteCount = db.prepare('SELECT COUNT(*) as count FROM notes').get().count;
    const adminCount = db.prepare('SELECT COUNT(*) as count FROM users WHERE is_admin = 1').get().count;

    res.json({
      totalUsers: userCount,
      totalNotes: noteCount,
      totalAdmins: adminCount
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats.' });
  }
});

export default router;
