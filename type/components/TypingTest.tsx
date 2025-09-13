'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const sampleTexts = [
  "The quick brown fox jumps over the lazy dog. This sentence contains all the letters in the English alphabet.",
  "Programming is the process of creating a set of instructions that tell a computer how to perform a task. Programming can be done using many programming languages.",
  "The best way to predict the future is to invent it. Computer scientists everywhere must take responsibility for the future they are creating.",
  "Typing quickly and accurately is an essential skill for developers and writers. Practice makes perfect when it comes to improving your typing skills.",
  "React is a JavaScript library for building user interfaces. It is maintained by Facebook and a community of individual developers and companies.",
  "To be or not to be, that is the question. Whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune.",
  "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.",
  "In the beginning God created the heavens and the earth. Now the earth was formless and empty, darkness was over the surface of the deep.",
  "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness.",
  "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore."
];

export default function TypingTest() {
  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [selectedTime, setSelectedTime] = useState(60);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpmHistory, setWpmHistory] = useState<number[]>([]);
  const [keyStrokes, setKeyStrokes] = useState<number>(0);
  const [errors, setErrors] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate text based on selected time
  const generateText = useCallback((time: number) => {
    // Adjust text length based on time (longer time = more text)
    const lengthFactor = time / 60; // 60s as baseline
    const targetLength = Math.floor(300 * lengthFactor); // ~300 chars for 60s
    
    let generatedText = '';
    let attempts = 0;
    
    while (generatedText.length < targetLength && attempts < 10) {
      const randomIndex = Math.floor(Math.random() * sampleTexts.length);
      const candidateText = sampleTexts[randomIndex];
      
      if (generatedText.length + candidateText.length <= targetLength * 1.5) {
        generatedText += (generatedText ? ' ' : '') + candidateText;
      }
      attempts++;
    }
    
    // If we still don't have enough text, pad with another sample
    if (generatedText.length < targetLength) {
      const extraIndex = Math.floor(Math.random() * sampleTexts.length);
      generatedText += ' ' + sampleTexts[extraIndex];
    }
    
    // Trim to approximate target length
    if (generatedText.length > targetLength) {
      generatedText = generatedText.substring(0, targetLength);
      // Find the last space to avoid cutting words in half
      const lastSpaceIndex = generatedText.lastIndexOf(' ');
      if (lastSpaceIndex > targetLength * 0.7) {
        generatedText = generatedText.substring(0, lastSpaceIndex);
      }
    }
    
    return generatedText;
  }, []);

  useEffect(() => {
    setText(generateText(selectedTime));
    setTimeLeft(selectedTime);
  }, [selectedTime, generateText]);

  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsFinished(true);
            setIsActive(false);
            calculateResults();
            return 0;
          }
          return prev - 1;
        });

        // Update WPM history every second
        if (startTime) {
          const elapsedTime = (selectedTime - timeLeft) + 1;
          const words = userInput.trim().split(/\s+/).length;
          const currentWpm = Math.round(words / (elapsedTime / 60));
          setWpmHistory(prev => {
            const newHistory = [...prev];
            newHistory[elapsedTime - 1] = currentWpm;
            return newHistory;
          });
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, timeLeft, startTime, userInput, selectedTime]);

  useEffect(() => {
    if (userInput.length > 0 && !isActive && !isFinished) {
      setIsActive(true);
      setStartTime(Date.now());
    }

    // Check if user completed the text before time runs out
    if (userInput.length === text.length && !isFinished && isActive) {
      setIsFinished(true);
      setIsActive(false);
      calculateResults();
    }
  }, [userInput, text, isActive, isFinished]);

  const calculateResults = useCallback(() => {
    const words = userInput.trim().split(/\s+/).length;
    const elapsedSeconds = selectedTime - timeLeft;
    const timeInMinutes = elapsedSeconds / 60 || 1 / 60;
    const calculatedWpm = Math.round(words / timeInMinutes);

    let correctChars = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === text[i]) {
        correctChars++;
      }
    }

    const calculatedAccuracy = userInput.length > 0 
      ? Math.round((correctChars / userInput.length) * 100)
      : 100;

    setWpm(calculatedWpm);
    setAccuracy(calculatedAccuracy);

    // Save results after calculation
    saveResults(calculatedWpm, calculatedAccuracy, elapsedSeconds);
  }, [userInput, text, selectedTime, timeLeft]);

  const saveResults = async (wpm: number, accuracy: number, time: number) => {
    setIsSaving(true);
    setSaveStatus('idle');
    
    try {
      // Save to API endpoint
      const response = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wpm, accuracy, time }),
      });

      if (response.ok) {
        console.log('Results saved successfully');
        setSaveStatus('success');
        
        // Send to webhook if needed
        await fetch('/api/webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ wpm, accuracy, time }),
        });
      } else {
        throw new Error('Failed to save results');
      }
    } catch (error) {
      console.error('Failed to save results:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const resetTest = useCallback(() => {
    setText(generateText(selectedTime));
    setUserInput('');
    setTimeLeft(selectedTime);
    setIsActive(false);
    setIsFinished(false);
    setWpm(0);
    setAccuracy(100);
    setWpmHistory([]);
    setKeyStrokes(0);
    setErrors(0);
    setStartTime(null);
    setSaveStatus('idle');
    
    // Clear the timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedTime, generateText]);

  const handleTimeChange = useCallback((seconds: number) => {
    setSelectedTime(seconds);
    if (!isActive && !isFinished) {
      setTimeLeft(seconds);
      setText(generateText(seconds));
    }
  }, [isActive, isFinished, generateText]);

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    setKeyStrokes(prev => prev + 1);
    
    // Count errors
    if (userInput.length < text.length) {
      if (e.key !== text[userInput.length] && e.key !== 'Backspace' && e.key !== 'Delete') {
        setErrors(prev => prev + 1);
      }
    }
  };

  const renderText = () => {
    return text.split('').map((char, index) => {
      if (index < userInput.length) {
        if (userInput[index] === char) {
          return <span key={index} className="text-green-700 bg-green-50">{char}</span>;
        } else {
          return <span key={index} className="text-red-700 bg-red-100 underline">{char}</span>;
        }
      } else if (index === userInput.length) {
        return <span key={index} className="bg-amber-200 text-brown-900 border-b-2 border-coffee-600">{char}</span>;
      } else {
        return <span key={index} className="text-brown-700">{char}</span>;
      }
    });
  };

  // Calculate stats for results
  const elapsedTime = selectedTime - timeLeft;
  const rawWpm = Math.round((userInput.length / 5) / (elapsedTime / 60));
  const netWpm = Math.max(0, rawWpm - Math.round(errors / (elapsedTime / 60)));

  // Prepare data for the chart
  const chartData = Array.from({ length: selectedTime }, (_, i) => ({
    time: i + 1,
    wpm: wpmHistory[i] || 0
  }));

  // Find max WPM for chart scaling
  const maxWpm = Math.max(1, ...wpmHistory.map(w => w || 0));

  return (
    <div className="max-w-4xl mx-auto p-6 bg-peach-50 rounded-lg shadow-md border border-peach-200">
      <h1 className="text-3xl font-bold mb-6 text-center text-brown-800">Typing Speed Test</h1>

      {/* Timer selection */}
      <div className="mb-6 flex justify-center space-x-4">
        {[30, 45, 60, 120].map((time) => (
          <button
            key={time}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedTime === time
                ? 'bg-coffee-600 text-peach-100 shadow-md'
                : 'bg-peach-200 text-brown-700 hover:bg-peach-300'
            }`}
            onClick={() => handleTimeChange(time)}
            disabled={isActive}
          >
            {time}s
          </button>
        ))}
      </div>

      {/* Timer display */}
      <div className="mb-4 text-center">
        <div className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-700 animate-pulse' : 'text-brown-800'}`}>
          Time Left: {timeLeft}s
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div 
            className="bg-coffee-600 h-2.5 rounded-full transition-all duration-1000" 
            style={{ width: `${(timeLeft / selectedTime) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Text display with progress - fixed positioning */}
      <div className="mb-6 p-6 bg-peach-100 rounded-lg border border-peach-300 shadow-sm relative overflow-hidden">
        <div className="absolute top-2 right-2 text-sm text-brown-600 bg-peach-200 px-2 py-1 rounded z-10">
          {userInput.length}/{text.length} characters
        </div>
        <div className="relative">
          <p className="text-lg leading-relaxed font-mono tracking-wide whitespace-pre-wrap break-words">
            {renderText()}
          </p>
        </div>
      </div>

      {/* Input area */}
      <textarea
        ref={inputRef}
        className="w-full h-32 p-4 border border-peach-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-coffee-500 bg-peach-50 text-brown-800 font-mono transition-all"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        disabled={isFinished}
        placeholder={isFinished ? "Test completed! Click 'Try Again' to restart" : "Start typing here..."}
        autoFocus
      />

      {/* Real-time stats */}
      {isActive && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-peach-200 p-3 rounded-lg text-center">
            <div className="text-sm text-brown-600">Current WPM</div>
            <div className="text-xl font-bold text-coffee-700">
              {wpmHistory.length > 0 ? wpmHistory[wpmHistory.length - 1] : 0}
            </div>
          </div>
          <div className="bg-peach-200 p-3 rounded-lg text-center">
            <div className="text-sm text-brown-600">Accuracy</div>
            <div className="text-xl font-bold text-coffee-700">
              {userInput.length > 0 ? Math.round((userInput.length - errors) / userInput.length * 100) : 100}%
            </div>
          </div>
          <div className="bg-peach-200 p-3 rounded-lg text-center">
            <div className="text-sm text-brown-600">Errors</div>
            <div className="text-xl font-bold text-coffee-700">{errors}</div>
          </div>
          <div className="bg-peach-200 p-3 rounded-lg text-center">
            <div className="text-sm text-brown-600">Keystrokes</div>
            <div className="text-xl font-bold text-coffee-700">{keyStrokes}</div>
          </div>
        </div>
      )}

      {/* Save status indicator */}
      {isSaving && (
        <div className="mb-4 p-3 bg-amber-100 text-brown-800 rounded-lg text-center">
          Saving your results...
        </div>
      )}
      {saveStatus === 'success' && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg text-center">
          Results saved successfully!
        </div>
      )}
      {saveStatus === 'error' && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg text-center">
          Failed to save results. Please try again.
        </div>
      )}

      {/* Results section */}
      {isFinished && (
        <div className="mb-6 p-6 bg-amber-50 rounded-lg border border-amber-200 shadow-sm">
          <h2 className="text-2xl font-bold mb-4 text-center text-brown-800">Test Results</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-peach-200 p-4 rounded-lg text-center">
              <div className="text-sm text-brown-600">WPM</div>
              <div className="text-3xl font-bold text-coffee-700">{wpm}</div>
            </div>
            <div className="bg-peach-200 p-4 rounded-lg text-center">
              <div className="text-sm text-brown-600">Accuracy</div>
              <div className="text-3xl font-bold text-coffee-700">{accuracy}%</div>
            </div>
            <div className="bg-peach-200 p-4 rounded-lg text-center">
              <div className="text-sm text-brown-600">Time</div>
              <div className="text-3xl font-bold text-coffee-700">{elapsedTime}s</div>
            </div>
            <div className="bg-peach-200 p-4 rounded-lg text-center">
              <div className="text-sm text-brown-600">Errors</div>
              <div className="text-3xl font-bold text-coffee-700">{errors}</div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-brown-800">Typing Speed Distribution</h3>
            <div className="bg-white p-4 rounded-lg border border-peach-300 h-64 flex items-end">
              <div className="flex-1 flex items-end justify-between">
                {chartData.map((data, index) => (
                  <div 
                    key={index} 
                    className="flex-1 mx-0.5 bg-coffee-500 rounded-t transition-all"
                    style={{ 
                      height: data.wpm > 0 ? `${Math.min(100, (data.wpm / maxWpm) * 100)}%` : '0%',
                      minHeight: data.wpm > 0 ? '2px' : '0px'
                    }}
                    title={`Second ${data.time}: ${data.wpm} WPM`}
                  ></div>
                ))}
              </div>
            </div>
            <div className="text-center text-sm text-brown-600 mt-2">
              Time (seconds)
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-amber-100 p-4 rounded-lg">
              <h4 className="font-semibold text-brown-800 mb-2">Additional Stats</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Raw WPM:</span>
                  <span className="font-medium">{rawWpm}</span>
                </div>
                <div className="flex justify-between">
                  <span>Net WPM:</span>
                  <span className="font-medium">{netWpm}</span>
                </div>
                <div className="flex justify-between">
                  <span>Characters:</span>
                  <span className="font-medium">{userInput.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Words:</span>
                  <span className="font-medium">{userInput.trim().split(/\s+/).length}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-amber-100 p-4 rounded-lg">
              <h4 className="font-semibold text-brown-800 mb-2">Performance Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Keystrokes:</span>
                  <span className="font-medium">{keyStrokes}</span>
                </div>
                <div className="flex justify-between">
                  <span>Error Rate:</span>
                  <span className="font-medium">
                    {userInput.length > 0 ? ((errors / userInput.length) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Completion:</span>
                  <span className="font-medium">
                    {((userInput.length / text.length) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center space-x-6">
          {!isFinished && (isActive || userInput.length > 0) && (
            <div className="text-lg bg-peach-200 px-3 py-1 rounded-md">
              <span className="font-semibold text-brown-800">WPM:</span> 
              <span className="ml-1 text-coffee-700 font-bold">
                {wpmHistory.length > 0 ? wpmHistory[wpmHistory.length - 1] : 0}
              </span>
            </div>
          )}
          {!isFinished && (isActive || userInput.length > 0) && (
            <div className="text-lg bg-peach-200 px-3 py-1 rounded-md">
              <span className="font-semibold text-brown-800">Accuracy:</span> 
              <span className="ml-1 text-coffee-700 font-bold">
                {userInput.length > 0 ? Math.round((userInput.length - errors) / userInput.length * 100) : 100}%
              </span>
            </div>
          )}
        </div>
        
        {(isFinished || (userInput.length > 0 && !isActive)) ? (
          <button
            className="bg-coffee-600 text-peach-100 px-6 py-3 rounded-lg font-semibold hover:bg-coffee-700 transition-colors shadow-md"
            onClick={resetTest}
          >
            Try Again
          </button>
        ) : null}
      </div>

      {/* Instructions */}
      <div className="text-sm text-brown-700 mt-8 p-4 bg-amber-100 rounded-lg border border-amber-200">
        <p className="font-semibold mb-2 text-brown-800">Instructions:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Select your preferred test duration (30, 45, 60, or 120 seconds)</li>
          <li>Type the text as quickly and accurately as possible</li>
          <li>Pasting text is disabled</li>
          <li>Green text indicates correct characters, red indicates errors</li>
          <li>Your words per minute (WPM) and accuracy will be calculated</li>
          <li>The test will end automatically when you complete the text or time runs out</li>
        </ul>
      </div>

      {/* Custom style for peach and coffee theme */}
      <style jsx>{`
        .bg-peach-50 { background-color: #FFF5EB; }
        .bg-peach-100 { background-color: #FFE8D6; }
        .bg-peach-200 { background-color: #FEDEC8; }
        .bg-peach-300 { background-color: #FDD0B2; }
        .border-peach-200 { border-color: #FEDEC8; }
        .border-peach-300 { border-color: #FDD0B2; }
        .text-brown-700 { color: #5C4B41; }
        .text-brown-800 { color: #4A3C34; }
        .text-brown-900 { color: #3A2E28; }
        .bg-coffee-600 { background-color: #8B5E3C; }
        .bg-coffee-700 { background-color: #754C29; }
        .text-coffee-700 { color: #754C29; }
        .bg-amber-50 { background-color: #FFFBEB; }
        .bg-amber-100 { background-color: #FEF3C7; }
      `}</style>
    </div>
  );
}