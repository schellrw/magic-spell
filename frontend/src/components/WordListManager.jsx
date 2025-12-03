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
  const navigate = useNavigate();

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

  const handleCreateWordList = async (e) => {
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
      await wordListService.create(listName, wordsArray);
      setListName('');
      setWordsInput('');
      await fetchWordLists(); // Refresh the list
      alert('Word list created successfully!');
    } catch (err) {
      setError('Failed to create word list.');
      console.error('Error creating word list:', err);
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
      <h1 className="text-4xl font-bold text-purple-800 text-center mb-8">Manage Word Lists</h1>

      <form onSubmit={handleCreateWordList} className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto mb-8">
        <h2 className="text-2xl font-semibold text-purple-700 mb-4">Create New Word List</h2>
        <div className="mb-4">
          <label htmlFor="listName" className="block text-purple-600 text-lg font-medium mb-2">List Name</label>
          <input
            type="text"
            id="listName"
            className="w-full p-3 border border-purple-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            placeholder="e.g., Week 1 Spelling"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="wordsInput" className="block text-purple-600 text-lg font-medium mb-2">Words (comma-separated)</label>
          <textarea
            id="wordsInput"
            className="w-full p-3 border border-purple-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-24"
            value={wordsInput}
            onChange={(e) => setWordsInput(e.target.value)}
            placeholder="e.g., apple, banana, cherry, dog"
          ></textarea>
        </div>
        <MagicButton
          type="submit"
          onClick={handleCreateWordList}
          className="w-full text-xl"
        >
          Create Word List
        </MagicButton>
        {error && <p className="text-red-500 mt-4 text-center text-lg">{error}</p>}
      </form>

      <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-purple-700 mb-4">Existing Word Lists</h2>
        {wordLists.length === 0 ? (
          <p className="text-center text-lg text-gray-600">No word lists found. Create one above!</p>
        ) : (
          <ul className="space-y-4">
            {wordLists.map((list) => (
              <li key={list.id} className="flex items-center justify-between bg-purple-50 p-4 rounded-lg shadow-sm gap-4">
                <div className="flex-grow">
                  <p className="text-xl font-semibold text-purple-800">{list.name}</p>
                  <p className="text-gray-600 text-md">Words: {list.words.map(word => word.text).join(', ')}</p>
                  <p className={`text-md font-medium ${list.is_active ? 'text-green-600' : 'text-red-600'}`}>
                    Status: {list.is_active ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <div className="flex items-center flex-shrink-0">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      value=""
                      className="sr-only peer"
                      checked={list.is_active}
                      onChange={() => handleToggleActive(list.id, list.is_active)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                    <span className="ml-3 text-lg font-medium text-gray-900">{list.is_active ? 'Active' : 'Inactive'}</span>
                  </label>
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
