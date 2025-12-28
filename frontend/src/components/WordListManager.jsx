import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { wordListService } from '../services/supabase';
import MagicButton from './MagicButton';

const WordListManager = () => {
  const [listName, setListName] = useState('');
  const [wordsInput, setWordsInput] = useState('');
  const [wordLists, setWordLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();
  const formRef = React.useRef(null);

  useEffect(() => {
    fetchWordLists();
  }, []);

  const fetchWordLists = async () => {
    try {
      setLoading(true);
      const data = await wordListService.getAll();
      setWordLists(data);
    } catch (err) {
      setError('Failed to fetch word lists.');
      console.error('Error fetching word lists:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!listName || !wordsInput) {
      setError('Please provide both a list name and words.');
      return;
    }

    const wordsArray = wordsInput.split(',').map(word => word.trim()).filter(word => word.length > 0);

    if (wordsArray.length === 0) {
      setError('Please enter at least one word.');
      return;
    }

    try {
      if (editingId) {
        await wordListService.update(editingId, listName, wordsArray);
        alert('Word list updated successfully! Mastery status for these words has been reset.');
      } else {
        await wordListService.create(listName, wordsArray);
        alert('Word list created successfully!');
      }
      resetForm();
      await fetchWordLists(); // Refresh the list
    } catch (err) {
      setError(editingId ? 'Failed to update word list.' : 'Failed to create word list.');
      console.error('Error saving word list:', err);
    }
  };

  const resetForm = () => {
    setListName('');
    setWordsInput('');
    setEditingId(null);
    setError(null);
  };

  const handleEdit = (list) => {
    setEditingId(list.id);
    setListName(list.name);
    setWordsInput(list.words.map(w => w.text).join(', '));
    // Scroll to the form with a slight delay to ensure state update has processed
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this word list? It will be removed from view but test history will be preserved.')) {
      try {
        await wordListService.delete(id);
        await fetchWordLists();
      } catch (err) {
        setError('Failed to delete word list.');
        console.error('Error deleting word list:', err);
      }
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    setError(null);
    try {
      await wordListService.toggleActive(id, !currentStatus);
      await fetchWordLists(); // Refresh the list
    } catch (err) {
      setError('Failed to update word list status.');
      console.error('Error updating word list status:', err);
    }
  };

  if (loading) return <div className="text-3xl text-center p-8">Loading word lists...</div>;
  if (error) return <div className="text-red-500 text-3xl text-center p-8">Error: {error}</div>;

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold text-purple-200 text-center mb-8 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">Manage Word Lists</h1>

      <form ref={formRef} onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto mb-8">
        <h2 className="text-2xl font-semibold text-purple-700 mb-4">{editingId ? 'Edit Word List' : 'Create New Word List'}</h2>
        <div className="mb-4">
          <label htmlFor="listName" className="block text-purple-600 text-lg font-medium mb-2">List Name</label>
          <input
            type="text"
            id="listName"
            className="w-full p-3 border border-purple-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            placeholder="e.g., Week 1 Spelling"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="wordsInput" className="block text-purple-600 text-lg font-medium mb-2">Words (comma-separated)</label>
          <textarea
            id="wordsInput"
            className="w-full p-3 border border-purple-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-24 bg-white text-gray-900"
            value={wordsInput}
            onChange={(e) => setWordsInput(e.target.value)}
            placeholder="e.g., apple, banana, cherry, dog"
          ></textarea>
        </div>
        <div className="flex gap-4">
          <MagicButton
            type="submit"
            onClick={handleSubmit}
            className="flex-1 text-xl"
          >
            {editingId ? 'Update List' : 'Create List'}
          </MagicButton>
          {editingId && (
            <MagicButton
              type="button"
              onClick={resetForm}
              className="flex-1 text-xl bg-gray-500 hover:bg-gray-600 border-gray-600"
            >
              Cancel
            </MagicButton>
          )}
        </div>
        {error && <p className="text-red-500 mt-4 text-center text-lg">{error}</p>}
      </form>

      <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-purple-700 mb-4">Existing Word Lists</h2>
        {wordLists.length === 0 ? (
          <p className="text-center text-lg text-gray-600">No word lists found. Create one above!</p>
        ) : (
          <ul className="space-y-4">
            {wordLists.map((list) => (
              <li key={list.id} className="bg-purple-50 p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <div className="flex-grow">
                    <p className="text-xl font-semibold text-purple-800">{list.name}</p>
                    <p className="text-gray-600 text-md">Words: {list.words.map(word => word.text).join(', ')}</p>
                    <p className={`text-md font-medium ${list.is_active ? 'text-green-600' : 'text-red-600'}`}>
                      Status: {list.is_active ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  <div className="flex items-center flex-shrink-0">
                    <label className="relative inline-flex items-center cursor-pointer mr-4">
                      <input
                        type="checkbox"
                        value=""
                        className="sr-only peer"
                        checked={list.is_active}
                        onChange={() => handleToggleActive(list.id, list.is_active)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-2 border-t border-purple-200 pt-2 mt-2">
                  <button
                    onClick={() => handleEdit(list)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded text-sm transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(list.id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="text-center mt-8">
        <MagicButton
          onClick={() => navigate('/')}
          className="text-xl"
        >
          Go Home
        </MagicButton>
      </div>
    </div>
  );
};

export default WordListManager;
