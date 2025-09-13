'use client';

import { useState, useEffect, useRef } from 'react';

const sampleText = "The quick brown fox jumps over the lazy dog. This sentence contains all the letters in the English alphabet.";

export default function TypingTest() {
  const [text, setText] = useState(sampleText);
  const [userInput, setUserInput] = useState('');
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && !isFinished) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, isFinished]);

  useEffect(() => {
    if (userInput.length > 0 && !isActive) {
      setIsActive(true);
    }

    if (userInput.length === text.length) {
      setIsFinished(true);
      setIsActive(false);
      calculateResults();
    }
  }, [userInput, text, isActive]);

  const calculateResults = () => {
    const words = text.split(' ').length;
    const timeInMinutes = timer / 60;
    const calculatedWpm = Math.round(words / timeInMinutes);
    
    let correctChars = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === text[i]) {
        correctChars++;
      }
    }
    
    const calculatedAccuracy = Math.round((correctChars / userInput.length) * 100);
    
    setWpm(calculatedWpm);
    setAccuracy(calculatedAccuracy);
    
    // Save results to database
    saveResults(calculatedWpm, calculatedAccuracy, timer);
  };

  const saveResults = async (wpm: number, accuracy: number, time: number) => {
    try {
      const response = await fetch('/api/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wpm, accuracy, time }),
      });
      
      if (response.ok) {
        console.log('Results saved successfully');
        
        // Send Discord webhook
        await fetch('/api/webhook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            username: 'User', // You might want to get the actual username
            wpm, 
            accuracy, 
            time 
          }),
        });
      }
    } catch (error) {
      console.error('Failed to save results:', error);
    }
  };

  const resetTest = () => {
    setUserInput('');
    setTimer(0);
    setIsActive(false);
    setIsFinished(false);
    setWpm(0);
    setAccuracy(100);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Typing Test</h1>
      
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <p className="text-lg">{text}</p>
      </div>
      
      <textarea
        ref={inputRef}
        className="w-full h-32 p-3 border border-gray-300 rounded mb-4"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        disabled={isFinished}
        placeholder="Start typing here..."
      />
      
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="font-semibold">Time:</span> {timer}s
        </div>
        {isFinished && (
          <div>
            <span className="font-semibold">WPM:</span> {wpm} | 
            <span className="font-semibold"> Accuracy:</span> {accuracy}%
          </div>
        )}
      </div>
      
      {isFinished && (
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={resetTest}
        >
          Try Again
        </button>
      )}
    </div>
  );
}