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
  const { speak, cycleVoice, currentVoice } = useSpeech();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [shuffledWords, setShuffledWords] = useState([]);

  useEffect(() => {
    fetchActiveWordLists();
  }, []);

  const speakWord = useCallback((wordObject) => {
    if (wordObject && wordObject.text) {
      speak(wordObject.text);
    }
  }, [speak]);

  useEffect(() => {
    if (testStarted && shuffledWords.length > 0 && currentWordIndex < shuffledWords.length) {
      speakWord(shuffledWords[currentWordIndex]);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [testStarted, currentWordIndex, shuffledWords, speakWord]);

  useEffect(() => {
    const handleDocumentClick = (e) => {
      // If we are in the middle of a test, and the user clicks somewhere that isn't a button or input
      // we want to refocus the input to keep them "in the zone".
      if (testStarted && !testFinished && inputRef.current) {
        // Check if the clicked element is interactive (button, link, input)
        const isInteractive = e.target.closest('button, a, input, textarea, select');
        
        if (!isInteractive) {
          inputRef.current.focus();
        }
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, [testStarted, testFinished]);

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

  const handleChangeVoice = (e) => {
    e.preventDefault();
    cycleVoice();
    // Re-speak the word after a short delay to allow state update
    setTimeout(() => {
        if (shuffledWords[currentWordIndex]) {
            speak(shuffledWords[currentWordIndex].text);
        }
    }, 100);
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
    }, 2500); // Increased delay to enjoy the animation
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
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          {/* Flash Overlay */}
          <div className="fixed inset-0 bg-yellow-400/30 flash-success-animation z-40 pointer-events-none mix-blend-screen"></div>
          {/* Confetti on TOP of overlay */}
          <SparkleEffect count={100} spread={window.innerWidth / 2} minSize={8} maxSize={24} />
        </div>
      );
    } else if (feedback === 'incorrect') {
      const correctWord = shuffledWords[currentWordIndex].text;
      return (
        <div className="relative">
          <p className="text-red-400 text-4xl font-bold mt-6 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">Incorrect. The word was: {correctWord}</p>
          <FlubbedTrickEffect count={30} duration={1000} />
        </div>
      );
    }
    return null;
  };

  if (loading) return <div className="text-3xl text-center p-8 text-blue-700">Loading test...</div>;

  if (error) {
    return (
      <div className="min-h-screen p-8 flex flex-col items-center justify-center">
        <p className="text-red-400 text-3xl text-center mb-8">Error: {error}</p>
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
        <p className="text-red-400 text-3xl text-center mb-8">No active word lists found. Please go to "Manage Words" to activate one.</p>
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
    <div className={`min-h-screen p-8 flex flex-col items-center justify-center ${feedback === 'incorrect' ? 'shake-animation' : ''}`}>
      <h1 className="text-5xl font-bold text-green-300 mb-8 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">Spelling Pre-Test</h1>

      {!testStarted && !testFinished && (
        <div className="text-center">
          <p className="text-3xl text-green-200 mb-6">Ready to practice?</p>
          <p className="text-2xl text-green-200 mb-12">Active lists: {activeWordList.map(list => list.name).join(', ')}</p>
          <div className="flex flex-row space-x-12 justify-center">
            <MagicButton
              onClick={startTest}
              className="text-4xl py-6 px-12 shadow-xl"
            >
              Start Test
            </MagicButton>
            <MagicButton
              onClick={() => navigate('/')}
              className="text-4xl py-6 px-12 shadow-xl"
            >
              Go Home
            </MagicButton>
          </div>
        </div>
      )}

      {testStarted && !testFinished && (
        <div className="flex flex-col items-center">
          <p className="text-4xl text-green-200 mb-6">Word {currentWordIndex + 1} of {shuffledWords.length}</p>
          
          <div className="flex gap-4 mb-8">
            <MagicButton
                onClick={() => speakWord(shuffledWords[currentWordIndex])}
                className="text-3xl"
            >
                🔊 Hear Word
            </MagicButton>
            
            <button
                onClick={handleChangeVoice}
                className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg text-xl transition transform hover:scale-105 shadow-[0_4px_0_rgb(107,33,168)] hover:shadow-[0_2px_0_rgb(107,33,168)] hover:translate-y-[2px]"
                title={`Current voice: ${currentVoice ? currentVoice.name : 'Default'}`}
                type="button" 
            >
                🗣️ Change Voice
            </button>
          </div>

          <form onSubmit={handleSubmitWord} className="flex flex-col items-center">
            <input
              type="text"
              ref={inputRef}
              className="w-full max-w-2xl py-6 px-4 border-4 border-blue-400 rounded-lg text-4xl leading-normal text-center focus:outline-none focus:ring-4 focus:ring-blue-600 bg-white text-gray-900"
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
          <h2 className="text-5xl font-bold text-green-300 mb-6 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">Test Complete!</h2>
          <p className="text-4xl text-green-200 mb-8">You scored {score} out of {shuffledWords.length}!</p>
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
