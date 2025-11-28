import { useState, useEffect } from 'react';
import { notesApi } from '../api';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const data = await notesApi.getAll();
      setNotes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async ({ id, title, content }) => {
    if (id) {
      // Update existing note
      const updated = await notesApi.update(id, title, content);
      setNotes(notes.map(n => n.id === id ? updated : n));
    } else {
      // Create new note
      const created = await notesApi.create(title, content);
      setNotes([created, ...notes]);
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await notesApi.delete(id);
      setNotes(notes.filter(n => n.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const openNewNote = () => {
    setEditingNote(null);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Notes</h1>
          <p className="text-gray-600 mt-1">
            {notes.length} {notes.length === 1 ? 'note' : 'notes'}
          </p>
        </div>
        <button onClick={openNewNote} className="btn btn-primary flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>New Note</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Notes Grid */}
      {notes.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h3>
          <p className="text-gray-600 mb-6">Create your first note to get started</p>
          <button onClick={openNewNote} className="btn btn-primary">
            Create Note
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notes.map(note => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={handleEdit}
              onDelete={(id) => setDeleteConfirm(id)}
            />
          ))}
        </div>
      )}

      {/* Note Modal */}
      <NoteModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingNote(null);
        }}
        onSave={handleSave}
        note={editingNote}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setDeleteConfirm(null)} />
            <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Note?</h3>
              <p className="text-gray-600 mb-6">This action cannot be undone.</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="btn btn-danger flex-1"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
