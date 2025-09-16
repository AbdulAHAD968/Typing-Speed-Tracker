"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import type { JSX } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const sampleTexts = [
  "Patience is often misunderstood as simply waiting, but in truth it is the art of waiting with peace in the heart. Life will always test you with delays and obstacles, yet those who remain calm discover hidden opportunities along the way. The strongest trees are the ones that grew slowly but steadily, weathering every storm with quiet resilience.",
  "Failure is not the end of the road but a necessary teacher on the path to success. Every setback reveals a weakness to be strengthened and a lesson to be learned. Those who rise after falling not only move forward, they also inspire others to do the same. True success is born from the ashes of repeated attempts.",
  "Wisdom begins with humility-the recognition that no matter how much we know, there is always more to learn. The proud close their minds, but the humble remain students forever. To listen deeply is often more powerful than speaking loudly, for silence allows truth to reveal itself without force.",
  "Time is the most precious resource we will ever own. Money can be earned and lost again, but a single wasted moment is gone forever. The wise treat time as sacred, investing it in growth, relationships, and purpose. The way you spend your hours will define the story of your life.",
  "Courage is not the absence of fear, but the decision to move forward in spite of it. Every great achievement in history was built by someone who trembled but still acted. Fear is natural, but letting it control you is a choice. Bravery is the quiet whisper that says, 'Try again tomorrow.'",
  "True wealth is not measured by possessions, but by the peace and joy within. A person who owns little but lives with gratitude is richer than one who owns everything yet craves more. Contentment is the highest currency, and generosity multiplies it. Happiness is found not in having, but in appreciating.",
  "Discipline is the bridge between dreams and reality. Passion may spark the beginning, but discipline fuels the journey to completion. It is the ability to choose long-term growth over short-term comfort. With discipline, even ordinary people achieve extraordinary results.",
  "The mind is like a fertile garden, constantly growing what we plant. Negative thoughts are weeds that choke joy and hope, while positive thoughts are seeds that bloom into peace and progress. You cannot stop seeds from falling, but you can choose which ones to water. Protect your mind, and it will protect your future.",
  "Greatness is not found in titles or positions, but in service to others. The strongest leaders are those who lift people up instead of keeping them down. Power used for self fades quickly, but power used for good echoes through generations. True greatness is measured by the lives you touch.",
  "Happiness is not a destination to be reached, but a way of walking through life. Many postpone joy for the future, yet it is always available in the present. Gratitude unlocks it, turning even the simplest moments into treasures. Joy is found not in grand events, but in small daily miracles.",
  "Silence is a rare strength in a world filled with noise. It gives the mind space to think and the heart room to feel. Often, answers arrive not in constant talking, but in stillness. Learning to be comfortable in silence is one of life's greatest skills.",
  "Every sunrise is a reminder that we are given another chance to live with meaning. Yesterday's mistakes do not define today's opportunities. The morning calls us to rise with renewed energy, to let go of regret, and to begin again. Each day is a new page in the story of your life.",
  "Kindness is the most powerful force in the world because it needs no wealth or status to be given. A single act of kindness can ripple farther than we ever imagine. It heals wounds that medicine cannot reach and breaks barriers that logic cannot cross. To be kind is to leave light wherever you go.",
  "Comparison is the thief of joy, silently robbing us of peace. Every person's journey is unique, shaped by unseen struggles and victories. When you compare yourself to others, you measure with the wrong ruler. The only fair comparison is who you were yesterday versus who you are today.",
  "Knowledge fills the mind, but wisdom shapes the soul. One can memorize books yet remain blind to truth. Wisdom comes not only from study but from reflection, experience, and humility. It is the light that guides knowledge toward goodness.",
  "Life's storms are not punishments, but preparations. Just as fire refines gold, difficulties refine character. The challenges we endure often equip us for greater responsibilities ahead. Without rain, even the most fertile soil cannot bloom.",
  "Success should never be mistaken for finality. Achievements are milestones, not destinations. Likewise, failure is never fatal unless we refuse to rise again. What truly matters is the courage to keep moving forward no matter what.",
  "Gratitude transforms ordinary days into celebrations. It shifts our focus from what we lack to what we have. A grateful heart finds beauty in simplicity and peace in uncertainty. The more we practice gratitude, the more reasons we find to be thankful.",
  "True friendship is a treasure that cannot be bought or forced. It is built on trust, honesty, and unconditional support. Friends are those who walk beside you in light and do not abandon you in darkness. One loyal friend is more valuable than a thousand admirers.",
  "Destiny is not written in the stars, but in the choices we make each day. Small decisions compound into great outcomes over time. Waiting for luck is passive, but creating opportunity is powerful. The future belongs to those who act with intention."
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
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [finishedElapsed, setFinishedElapsed] = useState<number>(0);

  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const userInputRef = useRef<string>("");
  const selectedTimeRef = useRef<number>(selectedTime);
  const isActiveRef = useRef<boolean>(false);
  const isFinishedRef = useRef<boolean>(false);
  const textRef = useRef<string>(text);
  const keyStrokesRef = useRef<number>(0);

  useEffect(() => {
    selectedTimeRef.current = selectedTime;
  }, [selectedTime]);
  useEffect(() => {
    textRef.current = text;
  }, [text]);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const startIntervalIfNeeded = useCallback(() => {
    if (timerRef.current !== null) return;

    timerRef.current = window.setInterval(() => {
      if (!startTimeRef.current) return;

      const elapsedSec = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const newTimeLeft = Math.max(0, (selectedTimeRef.current || 60) - elapsedSec);

      setTimeLeft((prev) => (prev === newTimeLeft ? prev : newTimeLeft));

      const typed = userInputRef.current.trim();
      const words = typed ? typed.split(/\s+/).length : 0;
      const minutes = Math.max((Date.now() - (startTimeRef.current || Date.now())) / 60000, 1 / 60);
      const currentWpm = Math.round(words / minutes);

      setWpm(currentWpm);

      setWpmHistory((prev) => {
        const updated = [...prev];
        if (elapsedSec - 1 >= 0 && elapsedSec - 1 < updated.length) {
          updated[elapsedSec - 1] = currentWpm;
        }
        return updated;
      });

      setAccuracy(() => {
        const typedStr = userInputRef.current;
        if (!typedStr) return 100;
        let correctChars = 0;
        for (let i = 0; i < typedStr.length; i++) {
          if (typedStr[i] === textRef.current[i]) correctChars++;
        }
        return Math.round((correctChars / typedStr.length) * 100);
      });

      if (newTimeLeft <= 0) {
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

  const saveResults = useCallback(async (wpmToSave: number, accuracyToSave: number, timeSeconds: number) => {
    setIsSaving(true);
    setSaveStatus("idle");
    try {
      const res = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wpm: wpmToSave, accuracy: accuracyToSave, time: timeSeconds }),
      });

      if (res.ok) {
        setSaveStatus("success");
        try {
          await fetch("/api/webhook", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ wpm: wpmToSave, accuracy: accuracyToSave, time: timeSeconds }),
          });
        } catch {}
      } else {
        setSaveStatus("error");
      }
    } catch {
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  }, []);

  const finishTest = useCallback(() => {
    stopInterval();
    isActiveRef.current = false;
    isFinishedRef.current = true;
    setIsActive(false);
    setIsFinished(true);

    const elapsedTimeMs = Date.now() - (startTimeRef.current || Date.now());
    const elapsedSeconds = Math.max(1, Math.round(elapsedTimeMs / 1000));
    setFinishedElapsed(elapsedSeconds);

    const typed = userInputRef.current.trim();
    const words = typed ? typed.split(/\s+/).length : 0;
    const minutes = Math.max(elapsedTimeMs / 60000, 1 / 60);
    const finalWpm = Math.round(words / minutes);

    const typedStr = userInputRef.current;
    let correctChars = 0;
    for (let i = 0; i < typedStr.length; i++) {
      if (typedStr[i] === textRef.current[i]) correctChars++;
    }
    const finalAccuracy = typedStr.length > 0 ? Math.round((correctChars / typedStr.length) * 100) : 100;

    setWpm(finalWpm);
    setAccuracy(finalAccuracy);

    setWpmHistory((prev) => {
      const updated = [...prev.slice(0, elapsedSeconds)];
      if (elapsedSeconds > 0) {
        updated[elapsedSeconds - 1] = finalWpm;
      }
      return updated;
    });

    saveResults(finalWpm, finalAccuracy, elapsedSeconds);
  }, [stopInterval, saveResults]);

  const resetTest = useCallback(() => {
    stopInterval();
    startTimeRef.current = null;
    userInputRef.current = "";
    keyStrokesRef.current = 0;
    isActiveRef.current = false;
    isFinishedRef.current = false;

    setUserInput("");
    setTimeLeft(selectedTimeRef.current || 60);
    setIsActive(false);
    setIsFinished(false);
    setWpm(0);
    setAccuracy(100);
    setWpmHistory([]);
    setKeyStrokes(0);
    setErrors(0);
    setSaveStatus("idle");
    setFinishedElapsed(0);
  }, [stopInterval]);

  const startTest = useCallback(() => {
    if (isActiveRef.current || isFinishedRef.current) return;
    isActiveRef.current = true;
    setIsActive(true);
    startTimeRef.current = Date.now();

    setWpmHistory(Array(selectedTimeRef.current).fill(0));
    startIntervalIfNeeded();
  }, [startIntervalIfNeeded]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      userInputRef.current = value;
      setUserInput(value);

      const errs = calculateErrors(value, textRef.current);
      setErrors(errs);

      if (!isActiveRef.current && !isFinishedRef.current && value.length > 0) {
        startTest();
      }

      if (!isFinishedRef.current && value.length === textRef.current.length) {
        finishTest();
      }
    },
    [calculateErrors, finishTest, startTest]
  );

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const key = e.key;
    if (key.length === 1 || key === "Backspace" || key === "Delete" || key === "Enter" || key === " ") {
      keyStrokesRef.current += 1;
      setKeyStrokes(keyStrokesRef.current);
    }
  }, []);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
  }, []);

  const handleTimeChange = useCallback((seconds: number) => {
    if (isActiveRef.current) return;
    setSelectedTime(seconds);
    selectedTimeRef.current = seconds;
    setTimeLeft(seconds);

    const newText = generateTextForTime(seconds);
    setText(newText);
    textRef.current = newText;

    setWpmHistory(Array(seconds).fill(0));
  }, []);

  const elapsedTime = (() => {
    if (isFinished) {
      return finishedElapsed;
    }
    if (!startTimeRef.current) return 0;
    return Math.round((Date.now() - startTimeRef.current) / 1000);
  })();

  const rawWpm = (() => {
    const elapsed = Math.max(1, elapsedTime);
    return Math.round(((userInput.length / 5) / (elapsed / 60)) || 0);
  })();

  const netWpm = Math.max(0, rawWpm - Math.round((errors / Math.max(1, elapsedTime / 60)) || 0));

  const chartData = wpmHistory.map((wpmValue, index) => ({
    time: index + 1,
    wpm: wpmValue,
  }));

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-8 bg-peach-50 rounded-lg shadow-md border border-peach-200">
      <h1 className="text-3xl font-bold mt-8 mb-10 text-center text-brown-800">Typing Speed Test — Fixed</h1>

      {/* Timer selection */}
      <div className="mb-8 flex justify-center space-x-4">
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
      <div className="mb-6 text-center">
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
        <div className="mb-4 text-sm text-brown-600 bg-peach-200 px-2 py-1 rounded text-center">
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
            <div className="bg-white p-4 rounded-lg border border-peach-300 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" label={{ value: "Time (s)", position: "insideBottom", offset: -5 }} />
                  <YAxis label={{ value: "WPM", angle: -90, position: "insideLeft" }} />
                  <Tooltip />
                  <Bar dataKey="wpm" fill="#8B5E3C" />
                </BarChart>
              </ResponsiveContainer>
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
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
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
      <div className="text-sm text-brown-700 mt-10 p-4 bg-amber-100 rounded-lg border border-amber-200">
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