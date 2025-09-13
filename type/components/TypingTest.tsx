"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import type { JSX } from "react";

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

function generateTextForTime(time: number) {
  const lengthFactor = time / 60;
  const targetLength = Math.floor(300 * lengthFactor);
  let generatedText = "";
  let attempts = 0;

  while (generatedText.length < targetLength && attempts < 20) {
    const randomIndex = Math.floor(Math.random() * sampleTexts.length);
    const candidateText = sampleTexts[randomIndex];
    if (generatedText.length + candidateText.length <= targetLength * 1.5) {
      generatedText += (generatedText ? " " : "") + candidateText;
    }
    attempts++;
  }

  if (generatedText.length < targetLength) {
    const extraIndex = Math.floor(Math.random() * sampleTexts.length);
    generatedText += " " + sampleTexts[extraIndex];
  }

  if (generatedText.length > targetLength) {
    generatedText = generatedText.substring(0, targetLength);
    const lastSpaceIndex = generatedText.lastIndexOf(" ");
    if (lastSpaceIndex > Math.floor(targetLength * 0.7)) {
      generatedText = generatedText.substring(0, lastSpaceIndex);
    }
  }

  return generatedText.trim();
}

export default function TypingTest(): JSX.Element {
  // UI states
  const [text, setText] = useState<string>(() => generateTextForTime(60));
  const [userInput, setUserInput] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [selectedTime, setSelectedTime] = useState<number>(60);
  const [wpmHistory, setWpmHistory] = useState<number[]>([]);
  const [keyStrokes, setKeyStrokes] = useState<number>(0);
  const [errors, setErrors] = useState<number>(0);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // refs for mutable values to avoid stale closures and excessive renders
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const userInputRef = useRef<string>("");
  const selectedTimeRef = useRef<number>(selectedTime);
  const isActiveRef = useRef<boolean>(false);
  const isFinishedRef = useRef<boolean>(false);
  const textRef = useRef<string>(text);
  const keyStrokesRef = useRef<number>(0);

  // Keep refs in sync with state when necessary
  useEffect(() => { selectedTimeRef.current = selectedTime; }, [selectedTime]);
  useEffect(() => { textRef.current = text; }, [text]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // Start the interval when test becomes active
  const startIntervalIfNeeded = useCallback(() => {
    if (timerRef.current !== null) return; // already running

    timerRef.current = window.setInterval(() => {
      if (!startTimeRef.current) return;

      const elapsedSec = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const newTimeLeft = Math.max(0, (selectedTimeRef.current || 60) - elapsedSec);

      // Update timeLeft once per second
      setTimeLeft(prev => (prev === newTimeLeft ? prev : newTimeLeft));

      // WPM calculation based on elapsed time (use at least 1 second guard)
      const typed = userInputRef.current.trim();
      const words = typed ? typed.split(/\s+/).length : 0;
      const minutes = Math.max((Date.now() - (startTimeRef.current || Date.now())) / 60000, 1 / 60);
      const currentWpm = Math.round(words / minutes);

      setWpm(currentWpm);

      // update wpmHistory at the index for this second
      setWpmHistory(prev => {
        const size = selectedTimeRef.current || 60;
        const copy = prev.length === size ? [...prev] : Array(size).fill(0).map((v, i) => prev[i] || 0);
        if (elapsedSec > 0 && elapsedSec <= size) {
          copy[elapsedSec - 1] = currentWpm;
        }
        return copy;
      });

      // Update live accuracy (characters correct / typed)
      setAccuracy(() => {
        const typedStr = userInputRef.current;
        if (!typedStr) return 100;
        let correctChars = 0;
        for (let i = 0; i < typedStr.length; i++) {
          if (typedStr[i] === textRef.current[i]) correctChars++;
        }
        return Math.round((correctChars / typedStr.length) * 100);
      });

      // Finish when time runs out
      if (newTimeLeft <= 0) {
        // finish the test
        if (!isFinishedRef.current) {
          finishTest();
        }
      }
    }, 1000);
  }, []);

  const stopInterval = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const calculateErrors = useCallback((typed: string, source: string) => {
    let errs = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] !== source[i]) errs++;
    }
    return errs;
  }, []);

  const calculateResults = useCallback(async (elapsedSeconds: number) => {
    const typed = userInputRef.current.trim();
    const words = typed ? typed.split(/\s+/).length : 0;
    const minutes = Math.max(elapsedSeconds / 60, 1 / 60);
    const calculatedWpm = Math.round(words / minutes);

    // accuracy
    const typedStr = userInputRef.current;
    let correctChars = 0;
    for (let i = 0; i < typedStr.length; i++) {
      if (typedStr[i] === textRef.current[i]) correctChars++;
    }
    const calculatedAccuracy = typedStr.length > 0 ? Math.round((correctChars / typedStr.length) * 100) : 100;

    setWpm(calculatedWpm);
    setAccuracy(calculatedAccuracy);

    // Save results (fire and forget)
    await saveResults(calculatedWpm, calculatedAccuracy, elapsedSeconds);
  }, []);

  const finishTest = useCallback(() => {
    // stop timer
    stopInterval();

    isActiveRef.current = false;
    isFinishedRef.current = true;

    setIsActive(false);
    setIsFinished(true);

    const elapsedSeconds = Math.max(1, Math.round(((Date.now() - (startTimeRef.current || Date.now())) / 1000)));
    calculateResults(elapsedSeconds);
  }, [calculateResults, stopInterval]);

  const saveResults = useCallback(async (wpmToSave: number, accuracyToSave: number, timeSeconds: number) => {
    setIsSaving(true);
    setSaveStatus('idle');
    try {
      const res = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wpm: wpmToSave, accuracy: accuracyToSave, time: timeSeconds }),
      });

      if (res.ok) {
        setSaveStatus('success');
        // optionally call webhook
        try {
          await fetch('/api/webhook', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ wpm: wpmToSave, accuracy: accuracyToSave, time: timeSeconds }),
          });
        } catch (err) {
          // swallow webhook errors (non-critical)
        }
      } else {
        setSaveStatus('error');
      }
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  }, []);

  const resetTest = useCallback(() => {
    stopInterval();

    // reset refs
    startTimeRef.current = null;
    userInputRef.current = "";
    keyStrokesRef.current = 0;
    isActiveRef.current = false;
    isFinishedRef.current = false;

    // reset states
    setUserInput("");
    setTimeLeft(selectedTimeRef.current || 60);
    setIsActive(false);
    setIsFinished(false);
    setWpm(0);
    setAccuracy(100);
    setWpmHistory(Array(selectedTimeRef.current || 60).fill(0));
    setKeyStrokes(0);
    setErrors(0);
    setSaveStatus('idle');

    // focus handling - DOM element focus is managed where the textarea ref exists
  }, [stopInterval]);

  const startTest = useCallback(() => {
    if (isActiveRef.current || isFinishedRef.current) return;
    isActiveRef.current = true;
    setIsActive(true);

    startTimeRef.current = Date.now();

    // reset history array to selected size
    setWpmHistory(Array(selectedTimeRef.current || 60).fill(0));

    startIntervalIfNeeded();
  }, [startIntervalIfNeeded]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    userInputRef.current = value;
    setUserInput(value);

    // update errors live
    const errs = calculateErrors(value, textRef.current);
    setErrors(errs);

    // start test on first character
    if (!isActiveRef.current && !isFinishedRef.current && value.length > 0) {
      startTest();
    }

    // if user finished early by typing entire text
    if (!isFinishedRef.current && value.length === textRef.current.length) {
      finishTest();
    }
  }, [calculateErrors, finishTest, startTest]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const key = e.key;
    // Count only meaningful keystrokes: printable characters, backspace, delete, enter, space
    if (key.length === 1 || key === 'Backspace' || key === 'Delete' || key === 'Enter' || key === ' ') {
      keyStrokesRef.current += 1;
      setKeyStrokes(keyStrokesRef.current);
    }
  }, []);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
  }, []);

  const handleTimeChange = useCallback((seconds: number) => {
    if (isActiveRef.current) return; // don't allow change during active test
    setSelectedTime(seconds);
    selectedTimeRef.current = seconds;
    setTimeLeft(seconds);

    const newText = generateTextForTime(seconds);
    setText(newText);
    textRef.current = newText;

    // reset history size
    setWpmHistory(Array(seconds).fill(0));
  }, []);

  // derived stats for UI (raw/net WPM)
  const elapsedTime = (() => {
    if (!startTimeRef.current) return 0;
    if (isFinishedRef.current) {
      // approximate elapsed time from wpmHistory length or selectedTime
      const total = Math.round(((Date.now() - startTimeRef.current) / 1000));
      return total;
    }
    return Math.round(((Date.now() - startTimeRef.current) / 1000));
  })();

  const rawWpm = (() => {
    const elapsed = Math.max(1, elapsedTime);
    return Math.round(((userInput.length / 5) / (elapsed / 60)) || 0);
  })();

  const netWpm = Math.max(0, rawWpm - Math.round((errors / Math.max(1, elapsedTime / 60)) || 0));

  // textarea ref for focusing
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-peach-50 rounded-lg shadow-md border border-peach-200">
      <h1 className="text-3xl font-bold mb-6 text-center text-brown-800">Typing Speed Test — Fixed</h1>

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
            style={{ width: `${(timeLeft / Math.max(1, selectedTime)) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Text display */}
      <div className="mb-6 p-6 bg-peach-100 rounded-lg border border-peach-300 shadow-sm relative overflow-hidden">
        <div className="absolute top-2 right-2 text-sm text-brown-600 bg-peach-200 px-2 py-1 rounded z-10">
          {userInput.length}/{text.length} characters
        </div>
        <div className="relative">
          <p className="text-lg leading-relaxed font-mono tracking-wide whitespace-pre-wrap break-words">
            {text.split('').map((char, index) => {
              if (index < userInput.length) {
                return (
                  <span key={index} className={userInput[index] === char ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-100 underline'}>
                    {char}
                  </span>
                );
              } else if (index === userInput.length) {
                return (
                  <span key={index} className="bg-amber-200 text-brown-900 border-b-2 border-coffee-600">
                    {char}
                  </span>
                );
              }
              return <span key={index} className="text-brown-700">{char}</span>;
            })}
          </p>
        </div>
      </div>

      {/* Input */}
      <textarea
        ref={inputRef}
        className="w-full h-32 p-4 border border-peach-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-coffee-500 bg-peach-50 text-brown-800 font-mono transition-all"
        value={userInput}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        disabled={isFinished}
        placeholder={isFinished ? "Test completed! Click 'Try Again' to restart" : "Start typing here..."}
        autoFocus
      />

      {/* Live stats */}
      {isActive && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-peach-200 p-3 rounded-lg text-center">
            <div className="text-sm text-brown-600">Current WPM</div>
            <div className="text-xl font-bold text-coffee-700">{wpm}</div>
          </div>
          <div className="bg-peach-200 p-3 rounded-lg text-center">
            <div className="text-sm text-brown-600">Accuracy</div>
            <div className="text-xl font-bold text-coffee-700">{accuracy}%</div>
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

      {/* Save status */}
      {isSaving && (
        <div className="mb-4 p-3 bg-amber-100 text-brown-800 rounded-lg text-center">Saving your results...</div>
      )}
      {saveStatus === 'success' && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg text-center">Results saved successfully!</div>
      )}
      {saveStatus === 'error' && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg text-center">Failed to save results. Please try again.</div>
      )}

      {/* Final results */}
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
              <div className="text-3xl font-bold text-coffee-700">{Math.max(1, elapsedTime)}s</div>
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
                {wpmHistory.map((data, index) => (
                  <div 
                    key={index} 
                    className="flex-1 mx-0.5 bg-coffee-500 rounded-t transition-all"
                    style={{
                      height: data > 0 ? `${Math.min(100, (data / Math.max(1, Math.max(...wpmHistory))) * 100)}%` : '0%'
                    }}
                    title={`Second ${index + 1}: ${data} WPM`}
                  />
                ))}
              </div>
            </div>
            <div className="text-center text-sm text-brown-600 mt-2">Time (seconds)</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-amber-100 p-4 rounded-lg">
              <h4 className="font-semibold text-brown-800 mb-2">Additional Stats</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span>Raw WPM:</span><span className="font-medium">{rawWpm}</span></div>
                <div className="flex justify-between"><span>Net WPM:</span><span className="font-medium">{netWpm}</span></div>
                <div className="flex justify-between"><span>Characters:</span><span className="font-medium">{userInput.length}</span></div>
                <div className="flex justify-between"><span>Words:</span><span className="font-medium">{userInput.trim().split(/\s+/).length}</span></div>
              </div>
            </div>

            <div className="bg-amber-100 p-4 rounded-lg">
              <h4 className="font-semibold text-brown-800 mb-2">Performance Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span>Keystrokes:</span><span className="font-medium">{keyStrokes}</span></div>
                <div className="flex justify-between"><span>Error Rate:</span><span className="font-medium">{userInput.length > 0 ? ((errors / userInput.length) * 100).toFixed(1) : '0'}%</span></div>
                <div className="flex justify-between"><span>Completion:</span><span className="font-medium">{((userInput.length / text.length) * 100).toFixed(1)}%</span></div>
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
              <span className="ml-1 text-coffee-700 font-bold">{wpm}</span>
            </div>
          )}
          {!isFinished && (isActive || userInput.length > 0) && (
            <div className="text-lg bg-peach-200 px-3 py-1 rounded-md">
              <span className="font-semibold text-brown-800">Accuracy:</span>
              <span className="ml-1 text-coffee-700 font-bold">{userInput.length > 0 ? Math.round((userInput.length - errors) / userInput.length * 100) : 100}%</span>
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
