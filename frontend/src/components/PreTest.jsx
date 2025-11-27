import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { wordListService, testResultService } from '../services/supabase';
import useSpeech from '../hooks/useSpeech';

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

  useEffect(() => {
    fetchActiveWordList();
  }, []);

  const speakWord = useCallback((wordObject) => {
    speak(wordObject.text);
  }, [speak]);

  useEffect(() => {
    if (testStarted && activeWordList && activeWordList.words.length > 0 && currentWordIndex < activeWordList.words.length) {
      speakWord(activeWordList.words[currentWordIndex]);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [testStarted, currentWordIndex, activeWordList, speakWord]);

  const fetchActiveWordList = async () => {
    try {
      setLoading(true);
      const data = await wordListService.getActive();
      if (data) {
        setActiveWordList(data);
      } else {
        setError('No active word list found. Please activate one from the Manage Words section.');
      }
    } catch (err) {
      setError('Failed to fetch active word list.');
      console.error('Error fetching active word list:', err);
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

    const currentWord = activeWordList.words[currentWordIndex].text;
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
      if (currentWordIndex < activeWordList.words.length - 1) {
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
      await testResultService.create(
        activeWordList.id,
        score,
        activeWordList.words.length,
        { /* You can add more detailed results here later */ }
      );
      console.log('Test results saved!');
    } catch (err) {
      console.error('Failed to save test results:', err);
    }
  };

  const renderFeedback = () => {
    if (feedback === 'correct') {
      return <p className="text-green-600 text-3xl font-bold mt-4 animate-bounce">🎉 Correct! 🎉</p>;
    } else if (feedback === 'incorrect') {
      const correctWord = activeWordList.words[currentWordIndex].text;
      return <p className="text-red-600 text-3xl font-bold mt-4">Incorrect. The word was: {correctWord}</p>;
    }
    return null;
  };

  if (loading) return <div className="text-3xl text-center p-8 text-blue-700">Loading test...</div>;

  if (error) {
    return (
      <div className="min-h-screen bg-red-100 p-8 flex flex-col items-center justify-center">
        <p className="text-red-700 text-3xl text-center mb-8">Error: {error}</p>
        <button
          onClick={() => navigate('/manage')}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 px-8 rounded-lg text-2xl transition duration-300 ease-in-out transform hover:scale-105"
        >
          Go to Manage Words
        </button>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-2xl mt-4 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Go Home
        </button>
      </div>
    );
  }

  if (!activeWordList) {
    return (
      <div className="min-h-screen bg-red-100 p-8 flex flex-col items-center justify-center">
        <p className="text-red-700 text-3xl text-center mb-8">No active word list found. Please go to "Manage Words" to activate one.</p>
        <button
          onClick={() => navigate('/manage')}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 px-8 rounded-lg text-2xl transition duration-300 ease-in-out transform hover:scale-105"
        >
          Go to Manage Words
        </button>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-2xl mt-4 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-100 p-8 flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold text-green-800 mb-8">Spelling Pre-Test</h1>

      {!testStarted && !testFinished && (
        <div className="text-center">
          <p className="text-3xl text-green-700 mb-6">Ready to practice {activeWordList.name}?</p>
          <button
            onClick={startTest}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-6 px-12 rounded-xl shadow-lg text-4xl transition duration-300 ease-in-out transform hover:scale-105"
          >
            Start Test
          </button>
        </div>
      )}

      {testStarted && !testFinished && (
        <div className="flex flex-col items-center">
          <p className="text-4xl text-green-700 mb-6">Word {currentWordIndex + 1} of {activeWordList.words.length}</p>
          <button
            onClick={() => speakWord(activeWordList.words[currentWordIndex])}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg shadow-md text-3xl mb-8 transition duration-300 ease-in-out transform hover:scale-105"
          >
            🔊 Hear Word
          </button>
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
            <button
              type="submit"
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 px-12 rounded-lg shadow-lg text-3xl mt-8 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Check Answer
            </button>
          </form>
        </div>
      )}

      {testFinished && (
        <div className="text-center">
          <h2 className="text-5xl font-bold text-green-800 mb-6">Test Complete!</h2>
          <p className="text-4xl text-green-700 mb-8">You scored {score} out of {activeWordList.words.length}!</p>
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
