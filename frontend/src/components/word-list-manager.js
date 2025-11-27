// frontend/src/components/WordListManager.jsx
import { useState, useEffect } from 'react';
import { wordListService } from '../services/supabase';

export default function WordListManager() {
  const [wordLists, setWordLists] = useState([]);
  const [newListName, setNewListName] = useState('');
  const [newWords, setNewWords] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWordLists();
  }, []);

  const loadWordLists = async () => {
    try {
      setLoading(true);
      const lists = await wordListService.getAll();
      setWordLists(lists);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!newListName.trim() || !newWords.trim()) {
      setError('Please provide a name and words');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Split words by newline or comma
      const wordsArray = newWords
        .split(/[\n,]+/)
        .map(w => w.trim())
        .filter(w => w.length > 0);

      await wordListService.create(newListName, wordsArray);
      
      // Reset form
      setNewListName('');
      setNewWords('');
      
      // Reload lists
      await loadWordLists();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSetActive = async (id) => {
    try {
      setLoading(true);
      await wordListService.setActive(id);
      await loadWordLists();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this word list?')) return;

    try {
      setLoading(true);
      await wordListService.delete(id);
      await loadWordLists();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Word Lists</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Create New List Form */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Add New Word List</h2>
        <form onSubmit={handleCreateList}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              List Name (e.g., "Week of Nov 25")
            </label>
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Week of Nov 25"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Words (one per line or comma-separated)
            </label>
            <textarea
              value={newWords}
              onChange={(e) => setNewWords(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows="6"
              placeholder="apple&#10;banana&#10;cherry"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Creating...' : 'Create Word List'}
          </button>
        </form>
      </div>

      {/* Existing Word Lists */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Existing Word Lists</h2>
        
        {wordLists.length === 0 ? (
          <p className="text-gray-500">No word lists yet. Create one above!</p>
        ) : (
          <div className="space-y-4">
            {wordLists.map(list => (
              <div
                key={list.id}
                className={`border rounded-lg p-4 ${
                  list.is_active ? 'border-green-500 bg-green-50' : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {list.name}
                      {list.is_active && (
                        <span className="ml-2 text-sm bg-green-500 text-white px-2 py-1 rounded">
                          Active
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {list.words.length} words
                    </p>
                  </div>
                  
                  <div className="space-x-2">
                    {!list.is_active && (
                      <button
                        onClick={() => handleSetActive(list.id)}
                        className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Set Active
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(list.id)}
                      className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  {list.words.map((word, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-100 px-3 py-1 rounded text-sm"
                    >
                      {word.text}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}