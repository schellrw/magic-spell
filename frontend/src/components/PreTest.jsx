import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { wordListService, testResultService } from '../services/supabase';
import useSpeech from '../hooks/useSpeech';
import MagicButton from './MagicButton';
import SparkleEffect from './SparkleEffect';
import FlubbedTrickEffect from './FlubbedTrickEffect';

const PreTest = () => {
  const [activeWordList, setActiveWordList] = useState(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(''); // 'correct', 'incorrect', 'none'
  const [testStarted, setTestStarted] = useState(false);
  const [testFinished, setTestFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { speak } = useSpeech();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [shuffledWords, setShuffledWords] = useState([]);

  useEffect(() => {
    fetchActiveWordLists();
  }, []);

  const speakWord = useCallback((wordObject) => {
    speak(wordObject.text);
  }, [speak]);

  useEffect(() => {
    if (testStarted && shuffledWords.length > 0 && currentWordIndex < shuffledWords.length) {
      speakWord(shuffledWords[currentWordIndex]);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [testStarted, currentWordIndex, shuffledWords, speakWord]);

  const fetchActiveWordLists = async () => {
    try {
      setLoading(true);
      const data = await wordListService.getActives();
      if (data && data.length > 0) {
        setActiveWordList(data); // Store all active lists
        // Combine all words from active lists and shuffle them
        let allWords = [];
        data.forEach(list => {
          allWords = allWords.concat(list.words.map(word => ({ ...word, wordListId: list.id })));
        });
        // Fisher-Yates shuffle algorithm
        for (let i = allWords.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [allWords[i], allWords[j]] = [allWords[j], allWords[i]];
        }
        setShuffledWords(allWords);

      } else {
        setError('No active word lists found. Please activate one or more from the Manage Words section.');
      }
    } catch (err) {
      setError('Failed to fetch active word lists.');
      console.error('Error fetching active word lists:', err);
    } finally {
      setLoading(false);
    }
  };

  const startTest = () => {
    setTestStarted(true);
    setCurrentWordIndex(0);
    setScore(0);
    setFeedback('');
    setUserInput('');
    setTestFinished(false);
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
    setFeedback(''); // Clear feedback when user types
  };

  const handleSubmitWord = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const currentWord = shuffledWords[currentWordIndex].text;
    const isCorrect = userInput.trim().toLowerCase() === currentWord.toLowerCase();

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
      setFeedback('correct');
      speak('Correct!');
    } else {
      setFeedback('incorrect');
      speak(`Incorrect. The word was ${currentWord}.`);
    }

    // Wait a bit before moving to the next word or finishing
    setTimeout(() => {
      setUserInput('');
      if (currentWordIndex < shuffledWords.length - 1) {
        setCurrentWordIndex((prevIndex) => prevIndex + 1);
        setFeedback('');
      } else {
        endTest();
      }
    }, 2000); // 2 seconds delay
  };

  const endTest = async () => {
    setTestFinished(true);
    setTestStarted(false);
    try {
      const wordListIds = activeWordList.map(list => list.id);
      await testResultService.create(
        wordListIds, // Pass an array of word list IDs
        score,
        shuffledWords.length,
        { /* You can add more detailed results here later */ }
      );
      console.log('Test results saved!');
    } catch (err) {
      console.error('Failed to save test results:', err);
    }
  };

  const renderFeedback = () => {
    if (feedback === 'correct') {
      return (
        <div className="relative">
          <SparkleEffect />
        </div>
      );
    } else if (feedback === 'incorrect') {
      const correctWord = shuffledWords[currentWordIndex].text;
      return (
        <div className="relative">
          <p className="text-red-600 text-3xl font-bold mt-4">Incorrect. The word was: {correctWord}</p>
          <FlubbedTrickEffect />
        </div>
      );
    }
    return null;
  };

  if (loading) return <div className="text-3xl text-center p-8 text-blue-700">Loading test...</div>;

  if (error) {
    return (
      <div className="min-h-screen p-8 flex flex-col items-center justify-center">
        <p className="text-red-700 text-3xl text-center mb-8">Error: {error}</p>
        <MagicButton
          onClick={() => navigate('/manage')}
          className="text-2xl mb-8"
        >
          Go to Manage Words
        </MagicButton>
        <MagicButton
          onClick={() => navigate('/')}
          className="text-2xl mt-4"
        >
          Go Home
        </MagicButton>
      </div>
    );
  }

  if (!activeWordList || activeWordList.length === 0) {
    return (
      <div className="min-h-screen p-8 flex flex-col items-center justify-center">
        <p className="text-red-700 text-3xl text-center mb-8">No active word lists found. Please go to "Manage Words" to activate one.</p>
        <MagicButton
          onClick={() => navigate('/manage')}
          className="text-2xl mb-8"
        >
          Go to Manage Words
        </MagicButton>
        <MagicButton
          onClick={() => navigate('/')}
          className="text-2xl mt-4"
        >
          Go Home
        </MagicButton>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold text-green-800 mb-8">Spelling Pre-Test</h1>

      {!testStarted && !testFinished && (
        <div className="text-center">
          <p className="text-3xl text-green-700 mb-6">Ready to practice?</p>
          <p className="text-2xl text-green-700 mb-6">Active lists: {activeWordList.map(list => list.name).join(', ')}</p>
          <MagicButton
            onClick={startTest}
            className="text-4xl mb-8"
          >
            Start Test
          </MagicButton>
          <MagicButton
            onClick={() => navigate('/')}
            className="text-xl mt-12"
          >
            Go Home
          </MagicButton>
        </div>
      )}

      {testStarted && !testFinished && (
        <div className="flex flex-col items-center">
          <p className="text-4xl text-green-700 mb-6">Word {currentWordIndex + 1} of {shuffledWords.length}</p>
          <MagicButton
            onClick={() => speakWord(shuffledWords[currentWordIndex])}
            className="text-3xl mb-8"
          >
            🔊 Hear Word
          </MagicButton>
          <form onSubmit={handleSubmitWord} className="flex flex-col items-center">
            <input
              type="text"
              ref={inputRef}
              className="w-80 p-4 border-4 border-blue-400 rounded-lg text-4xl text-center focus:outline-none focus:ring-4 focus:ring-blue-600"
              value={userInput}
              onChange={handleInputChange}
              placeholder="Type the word here..."
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
            />
            {renderFeedback()}
            <MagicButton
              type="submit"
              className="text-3xl mt-8"
            >
              Check Answer
            </MagicButton>
          </form>
        </div>
      )}

      {testFinished && (
        <div className="text-center">
          <h2 className="text-5xl font-bold text-green-800 mb-6">Test Complete!</h2>
          <p className="text-4xl text-green-700 mb-8">You scored {score} out of {shuffledWords.length}!</p>
          <button
            onClick={startTest}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-2xl transition duration-300 ease-in-out transform hover:scale-105 mb-4"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-2xl ml-4 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Go Home
          </button>
        </div>
      )}
    </div>
  );
};

export default PreTest;
