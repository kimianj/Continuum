import { Router } from 'express';
import db from '../db/index.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get all notes for current user
router.get('/', (req, res) => {
  try {
    const notes = db.prepare(`
      SELECT id, title, content, created_at, updated_at 
      FROM notes 
      WHERE user_id = ? 
      ORDER BY updated_at DESC
    `).all(req.user.id);

    res.json(notes);
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ error: 'Failed to fetch notes.' });
  }
});

// Get single note
router.get('/:id', (req, res) => {
  try {
    const note = db.prepare(`
      SELECT id, title, content, created_at, updated_at 
      FROM notes 
      WHERE id = ? AND user_id = ?
    `).get(req.params.id, req.user.id);

    if (!note) {
      return res.status(404).json({ error: 'Note not found.' });
    }

    res.json(note);
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ error: 'Failed to fetch note.' });
  }
});

// Create note
router.post('/', (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required.' });
    }

    const result = db.prepare(`
      INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)
    `).run(req.user.id, title, content);

    const note = db.prepare('SELECT * FROM notes WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json(note);
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ error: 'Failed to create note.' });
  }
});

// Update note
router.put('/:id', (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required.' });
    }

    // Check if note exists and belongs to user
    const existingNote = db.prepare('SELECT id FROM notes WHERE id = ? AND user_id = ?')
      .get(req.params.id, req.user.id);

    if (!existingNote) {
      return res.status(404).json({ error: 'Note not found.' });
    }

    db.prepare(`
      UPDATE notes 
      SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ? AND user_id = ?
    `).run(title, content, req.params.id, req.user.id);

    const updatedNote = db.prepare('SELECT * FROM notes WHERE id = ?').get(req.params.id);

    res.json(updatedNote);
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ error: 'Failed to update note.' });
  }
});

// Delete note
router.delete('/:id', (req, res) => {
  try {
    // Check if note exists and belongs to user
    const existingNote = db.prepare('SELECT id FROM notes WHERE id = ? AND user_id = ?')
      .get(req.params.id, req.user.id);

    if (!existingNote) {
      return res.status(404).json({ error: 'Note not found.' });
    }

    db.prepare('DELETE FROM notes WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);

    res.json({ message: 'Note deleted successfully.' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ error: 'Failed to delete note.' });
  }
});

export default router;
