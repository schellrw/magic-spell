// frontend/src/components/PreTest.jsx
import { useState, useEffect } from 'react';
import { wordListService, testResultService } from '../services/supabase';
import { useSpeech } from '../hooks/useSpeech';

export default function PreTest() {
  const [wordList, setWordList] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [results, setResults] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const { speak, isSpeaking } = useSpeech();

  useEffect(() => {
    loadActiveWordList();
  }, []);

  const loadActiveWordList = async () => {
    try {
      const active = await wordListService.getActive();
      setWordList(active);
      setLoading(false);
      
      // Automatically speak first word
      if (active && active.words.length > 0) {
        setTimeout(() => speak(active.words[0].text), 500);
      }
    } catch (err) {
      console.error('Error loading word list:', err);
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const currentWord = wordList.words[currentIndex].text;
    const correct = userAnswer.trim().toLowerCase() === currentWord.toLowerCase();
    
    setIsCorrect(correct);
    setShowFeedback(true);
    
    // Store result
    const result = {
      word: currentWord,
      userAnswer: userAnswer.trim(),
      correct
    };
    setResults([...results, result]);

    // Auto-advance after showing feedback
    setTimeout(() => {
      if (currentIndex < wordList.words.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setUserAnswer('');
        setShowFeedback(false);
        
        // Speak next word
        setTimeout(() => speak(wordList.words[currentIndex + 1].text), 300);
      } else {
        // Test complete
        finishTest([...results, result]);
      }
    }, 2000);
  };

  const finishTest = async (finalResults) => {
    setIsComplete(true);
    
    // Save to database
    const score = finalResults.filter(r => r.correct).length;
    const total = finalResults.length;
    
    try {
      await testResultService.create(wordList.id, score, total, finalResults);
    } catch (err) {
      console.error('Error saving results:', err);
    }
  };

  const handleReplayWord = () => {
    speak(wordList.words[currentIndex].text);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setUserAnswer('');
    setResults([]);
    setIsComplete(false);
    setShowFeedback(false);
    setTimeout(() => speak(wordList.words[0].text), 500);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!wordList) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">No Active Word List</h2>
        <p className="text-gray-600">
          Ask a parent to set up this week's spelling words!
        </p>
      </div>
    );
  }

  if (isComplete) {
    const score = results.filter(r => r.correct).length;
    const percentage = Math.round((score / results.length) * 100);

    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Test Complete! 🎉</h2>
          <p className="text-5xl font-bold mb-6 text-blue-500">
            {score} / {results.length}
          </p>
          <p className="text-xl mb-6">
            You got {percentage}% correct!
          </p>

          {/* Results breakdown */}
          <div className="text-left mb-6">
            <h3 className="font-semibold mb-3">Results:</h3>
            <div className="space-y-2">
              {results.map((result, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded ${
                    result.correct ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  <span className="font-semibold">{result.word}</span>
                  {!result.correct && (
                    <span className="text-sm text-gray-600 ml-2">
                      (You wrote: {result.userAnswer})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleRestart}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            Take Test Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white shadow rounded-lg p-8">
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">
            Word {currentIndex + 1} of {wordList.words.length}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${((currentIndex + 1) / wordList.words.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={handleReplayWord}
            disabled={isSpeaking}
            className="bg-blue-500 text-white px-8 py-4 rounded-lg text-xl hover:bg-blue-600 disabled:bg-gray-400 mb-4"
          >
            🔊 {isSpeaking ? 'Speaking...' : 'Play Word'}
          </button>
          <p className="text-sm text-gray-500">
            Click to hear the word again
          </p>
        </div>

        {!showFeedback ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-lg font-medium mb-2">
                Type the word you heard:
              </label>
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="w-full px-4 py-3 text-2xl border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="Type here..."
                autoFocus
                autoComplete="off"
              />
            </div>

            <button
              type="submit"
              disabled={!userAnswer.trim()}
              className="w-full bg-green-500 text-white px-6 py-3 rounded-lg text-xl hover:bg-green-600 disabled:bg-gray-400"
            >
              Submit Answer
            </button>
          </form>
        ) : (
          <div className={`text-center p-6 rounded-lg ${
            isCorrect ? 'bg-green-100' : 'bg-yellow-100'
          }`}>
            <p className="text-3xl mb-2">
              {isCorrect ? '✅ Correct!' : '❌ Not quite!'}
            </p>
            {!isCorrect && (
              <p className="text-xl">
                The correct spelling is: <strong>{wordList.words[currentIndex].text}</strong>
              </p>
            )}
            <p className="text-sm text-gray-600 mt-2">
              Moving to next word...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}