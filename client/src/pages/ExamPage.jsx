import API_BASE from "../api.js";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useTabSwitchDetection from "../hooks/useTabSwitchDetection.js";

const ExamPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const examId = searchParams.get("id");
  const dialogRef = useRef(null);
  const lastCommandTime = useRef(0);
  const isSpeakingRef = useRef(false);
  const isAssistantActiveRef = useRef(true);
  const isRecognitionRunning = useRef(false);
  const recognitionRef = useRef(null);       // stable recognition instance
  const commandHandlerRef = useRef(null);    // always-fresh command handler

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [isAssistantActive, setIsAssistantActive] = useState(true);
  // Keep a ref in sync so event handlers always see the latest value
  useEffect(() => { isAssistantActiveRef.current = isAssistantActive; }, [isAssistantActive]);
  const [assistantStatus, setAssistantStatus] = useState("Initializing...");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [examInfo, setExamInfo] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [showImageDesc, setShowImageDesc] = useState(false);

  useEffect(() => {
    if (examId) {
      fetchExamQuestions();
    }
  }, [examId]);

  const fetchExamQuestions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/api/exams/${examId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setQuestions(data.questions || []);
        setExamInfo(data);
        setTimeLeft(data.duration * 60);
      }
    } catch (error) {
      console.error("Error fetching exam questions:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔊 Speak function
  const speak = useCallback((text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.onstart = () => {
      setIsSpeaking(true);
      isSpeakingRef.current = true;
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      isSpeakingRef.current = false;
    };
    window.speechSynthesis.speak(utterance);
  }, []);

  // � Handlers
  const handleSubmit = useCallback(() => {
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen();
    }
    window.speechSynthesis.cancel();
    const timeUsed = (examInfo?.duration * 60) - timeLeft;
    navigate("/exam/confirm-submit", {
      state: {
        examId,
        answers: selectedAnswers,
        timeUsed,
        totalQuestions: questions.length
      }
    });
  }, [navigate, examId, selectedAnswers, timeLeft, examInfo, questions]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  // ⏱️ Timer Effect
  useEffect(() => {
    if (loading || !examInfo) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, examInfo]);

  // 📢 Dynamic Voice Alerts for Timer
  useEffect(() => {
    if (loading || !examInfo || questions.length === 0 || !isAssistantActive) return;

    const totalSeconds = examInfo.duration * 60;
    const alertInterval = Math.max(1, Math.floor(totalSeconds / questions.length));

    if (timeLeft === 60) {
      speak("Warning. One minute remaining.");
    } else if (timeLeft === 0) {
      speak("Time is over. Submitting exam.");
      setTimeout(() => handleSubmit(), 2000);
    } else if (timeLeft < totalSeconds && timeLeft > 60 && timeLeft % alertInterval === 0) {
      const minutesLeft = Math.ceil(timeLeft / 60);
      const remainingQuestions = questions.length - currentQuestionIdx;
      speak(`Total time remaining ${minutesLeft} minutes. Total questions remaining ${remainingQuestions}.`);
    }
  }, [timeLeft, loading, examInfo, questions.length, currentQuestionIdx, isAssistantActive, speak, handleSubmit]);


  const handleNext = useCallback(() => {
    setCurrentQuestionIdx((prev) => (prev < questions.length - 1 ? prev + 1 : prev));
  }, [questions.length]);

  const handlePrevious = useCallback(() => {
    setCurrentQuestionIdx((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const handleOptionSelect = useCallback((optionIdx) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIdx]: optionIdx
    }));
  }, [currentQuestionIdx]);

  const handleVoiceSelect = useCallback((idx) => {
    handleOptionSelect(idx);
    speak(`Option ${idx + 1} selected.`);
    setTimeout(() => handleNext(), 1500);
  }, [handleOptionSelect, handleNext, speak]);

  const toggleMarkForReview = useCallback(() => {
    setMarkedForReview((prev) => ({
      ...prev,
      [currentQuestionIdx]: !prev[currentQuestionIdx]
    }));
  }, [currentQuestionIdx]);

  // 🔊 Read question when it changes
  useEffect(() => {
    if (!isAssistantActive || loading || questions.length === 0) return;

    const q = questions[currentQuestionIdx];
    if (!q) return;

    const imageDesc = q.image ? `ACCESSIBILITY ALERT. This question includes a visual asset. Description: ${q.accessibilityText || "No detailed description provided."}. ` : "";

    const text = `
      ${imageDesc}
      Question Number ${currentQuestionIdx + 1}. 
      ${q.text}. 
      Option 1: ${q.options?.[0] || ""}. 
      Option 2: ${q.options?.[1] || ""}. 
      Option 3: ${q.options?.[2] || ""}. 
      Option 4: ${q.options?.[3] || ""}.
    `;

    setAssistantStatus("Reading Question...");
    speak(text);
  }, [currentQuestionIdx, speak, isAssistantActive, loading, questions]);

  // 🎤 Always keep the command handler ref up-to-date (no stale closures)
  useEffect(() => {
    commandHandlerRef.current = (transcript) => {
      if (/\b(option 1|option one|select 1|select one|choose 1|choose one|number 1|number one|answer 1|answer one)\b/.test(transcript)) {
        handleVoiceSelect(0);
      } else if (/\b(option 2|option two|select 2|select two|choose 2|choose two|number 2|number two|answer 2|answer two)\b/.test(transcript)) {
        handleVoiceSelect(1);
      } else if (/\b(option 3|option three|select 3|select three|choose 3|choose three|number 3|number three|answer 3|answer three)\b/.test(transcript)) {
        handleVoiceSelect(2);
      } else if (/\b(option 4|option four|select 4|select four|choose 4|choose four|number 4|number four|answer 4|answer four)\b/.test(transcript)) {
        handleVoiceSelect(3);
      } else if (/\b(next|move forward|skip)\b/.test(transcript)) {
        handleNext();
      } else if (/\b(previous|back|go back|move back)\b/.test(transcript)) {
        handlePrevious();
      } else if (/\b(submit|finish|end exam|complete)\b/.test(transcript)) {
        handleSubmit();
      } else if (/\b(read|repeat|read question|repeat question|describe again|describe image)\b/.test(transcript)) {
        const q = questions[currentQuestionIdx];
        if (!q) return false;
        const imageDesc = q.image
          ? `ACCESSIBILITY ALERT. This question includes a visual asset. Description: ${q.accessibilityText || "No detailed description provided."}. `
          : "";
        speak(`${imageDesc} Question Number ${currentQuestionIdx + 1}. ${q.text}. Option 1: ${q.options?.[0] || ""}. Option 2: ${q.options?.[1] || ""}. Option 3: ${q.options?.[2] || ""}. Option 4: ${q.options?.[3] || ""}.`);
      } else {
        return false; // not matched
      }
      return true; // matched
    };
  }, [handleVoiceSelect, handleNext, handlePrevious, handleSubmit, questions, currentQuestionIdx, speak]);

  // 🎤 Voice Recognition — single stable instance, never torn down on state change
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false; // Only process FINAL results — prevents phantom matches
    recognition.lang = "en-US";
    recognitionRef.current = recognition;

    const tryStart = () => {
      if (!isRecognitionRunning.current) {
        try {
          recognition.start();
        } catch (_) { /* suppress if already running */ }
      }
    };

    recognition.onstart = () => {
      isRecognitionRunning.current = true;
      setAssistantStatus("Listening...");
    };

    recognition.onend = () => {
      isRecognitionRunning.current = false;
      // Auto-restart unless assistant was paused
      if (isAssistantActiveRef.current) {
        setTimeout(tryStart, 300);
      }
    };

    recognition.onresult = (event) => {
      // Ignore if assistant is paused or a command was just fired
      if (!isAssistantActiveRef.current) return;
      if (Date.now() - lastCommandTime.current < 1500) return;

      const result = event.results[event.results.length - 1];
      if (!result.isFinal) return; // extra safety for any browser that sends interim

      const transcript = result[0].transcript.toLowerCase().trim();
      console.log("[Voice] heard:", transcript);

      if (commandHandlerRef.current) {
        const matched = commandHandlerRef.current(transcript);
        if (matched) {
          lastCommandTime.current = Date.now();
          console.log("[Voice] Command matched:", transcript);
        }
      }
    };

    recognition.onerror = (e) => {
      isRecognitionRunning.current = false;
      if (e.error === "no-speech") return; // benign, onend will fire and restart
      console.warn("[Voice] Recognition error:", e.error);
      setAssistantStatus("Listening (recovering)...");
      setTimeout(tryStart, 1000);
    };

    tryStart();

    return () => {
      recognition.onend = null;
      recognition.onerror = null;
      recognition.onresult = null;
      isRecognitionRunning.current = false;
      try { recognition.stop(); } catch (_) { }
      recognitionRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ← empty deps: ONE instance for entire component lifetime

  // Pause/resume recognition when isAssistantActive changes
  useEffect(() => {
    if (!recognitionRef.current) return;
    if (!isAssistantActive) {
      try { recognitionRef.current.stop(); } catch (_) { }
    } else if (!isRecognitionRunning.current) {
      try { recognitionRef.current.start(); } catch (_) { }
    }
  }, [isAssistantActive]);


  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (key >= "1" && key <= "4") {
        handleOptionSelect(parseInt(key) - 1);
      } else if (key === "n" || e.key === "ArrowRight") {
        handleNext();
      } else if (key === "p" || e.key === "ArrowLeft") {
        handlePrevious();
      } else if (key === "m") {
        toggleMarkForReview();
      } else if (key === "r") {
        const q = questions[currentQuestionIdx];
        const imageDesc = q.image ? `ACCESSIBILITY ALERT. This question includes a visual asset. Description: ${q.accessibilityText || "No detailed description provided."}. ` : "";
        const textToSpeech = `${imageDesc} Question Number ${currentQuestionIdx + 1}. ${q.text}. Option 1: ${q.options?.[0] || ""}. Option 2: ${q.options?.[1] || ""}. Option 3: ${q.options?.[2] || ""}. Option 4: ${q.options?.[3] || ""}.`;
        speak(textToSpeech);
      } else if (key === "s") {
        handleSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentQuestionIdx, handleNext, handlePrevious, handleOptionSelect, handleSubmit, toggleMarkForReview, questions, speak]);

  const enterFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  };

  const { warningCount, isWarningOpen, closeWarning } = useTabSwitchDetection({
    examId: examId,
    studentId: "user", // Usually you'd get this from auth context, but 'user' suffix is often fine or fetched from token
    onAutoSubmit: handleSubmit
  });

  const handleCloseWarning = () => {
    enterFullscreen();
    closeWarning();
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        window.alert("You exited fullscreen. Please return to the exam.");
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (isWarningOpen && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [isWarningOpen]);

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b-4 border-primary px-3 md:px-6 py-2 shadow-md">
          <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-white p-1.5 rounded-lg">
                <span className="material-symbols-outlined text-xl">school</span>
              </div>
              <div>
                <h1 className="text-base md:text-lg font-bold tracking-tight">
                  {loading ? "Authenticating Session..." : (examInfo?.title || "Exam In Progress")}
                </h1>
                <div className="flex items-center gap-1.5 text-primary font-medium">
                  <span className="material-symbols-outlined text-[10px]">cloud_done</span>
                  <span className="text-[10px] uppercase tracking-wider">
                    Auto-saved at 10:45 AM
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 border-r border-slate-200 dark:border-slate-700 pr-3">
                <button className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-semibold uppercase text-[10px]">
                  <span className="material-symbols-outlined">contrast</span>
                  Contrast
                </button>
                <button className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-semibold uppercase text-[10px]">
                  <span className="material-symbols-outlined">format_size</span>
                  Font Size
                </button>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="bg-primary text-white px-3.5 py-1.5 rounded-xl flex items-center gap-2 shadow-lg">
                  <span className="material-symbols-outlined text-lg">timer</span>
                  <span className="text-lg md:text-xl font-black tabular-nums tracking-widest">
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <button
                  aria-label="Accessibility Settings"
                  className="bg-slate-200 dark:bg-slate-800 p-2 rounded-lg hover:bg-slate-300 transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined">person_raised_hand</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-grow max-w-[1400px] mx-auto w-full p-2 md:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
          {loading ? (
            <div className="lg:col-span-12 flex flex-col items-center justify-center py-40">
              <div className="size-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
              <p className="text-xl font-bold uppercase tracking-widest text-slate-500 animate-pulse">Engaging Security Protocols...</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="lg:col-span-12 flex flex-col items-center justify-center py-40 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">error</span>
              <p className="text-xl font-bold text-slate-500 italic">No nodes found in this assessment batch.</p>
              <button onClick={() => navigate("/dashboard")} className="mt-8 px-8 py-3 bg-primary text-white rounded-xl font-bold">Return to Dashboard</button>
            </div>
          ) : (
            <>
              <div className="lg:col-span-8 space-y-3">
                <div className={`border - 2 rounded - xl p - 3 md: p - 4 flex flex - col sm: flex - row items - center justify - between gap - 3 transition - colors ${isAssistantActive ? 'bg-primary/10 border-primary/30' : 'bg-slate-100 border-slate-200 opacity-60'} `}>
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center">
                      {isAssistantActive && (
                        <div className={`absolute w - 10 h - 10 rounded - full animate - ping ${isSpeaking ? 'bg-indigo-400/40' : 'bg-primary/20'} `} />
                      )}
                      <div className={`relative p - 2.5 rounded - full shadow - lg transition - colors ${isAssistantActive ? 'bg-primary text-white' : 'bg-slate-400 text-slate-100'} `}>
                        <span className="material-symbols-outlined text-2xl">
                          {isSpeaking ? 'volume_up' : isAssistantActive ? 'mic' : 'mic_off'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className={`text - sm md: text - base font - bold ${isAssistantActive ? 'text-primary' : 'text-slate-500'} `}>
                        Voice Assistant {isAssistantActive ? 'Active' : 'Paused'}
                      </p>
                      <p className="text-[11px] md:text-xs text-slate-600 dark:text-slate-400 font-medium">
                        {isAssistantActive ? assistantStatus : 'Enable assistant to use voice commands.'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-2 py-1.5 rounded-xl border border-primary/20 shadow-sm">
                    <span className="text-[10px] font-black px-1.5 text-slate-500 uppercase">Assistant Toggle</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        className="sr-only peer"
                        type="checkbox"
                        checked={isAssistantActive}
                        onChange={(e) => setIsAssistantActive(e.target.checked)}
                      />
                      <div className="w-14 h-7 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary" />
                    </label>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <div className="p-4 md:p-5">
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-primary/10 text-primary px-3 py-0.5 rounded-full font-semibold text-xs md:text-sm">
                        Question {currentQuestionIdx + 1} of {questions.length}
                      </span>
                      <button
                        onClick={() => {
                          const q = questions[currentQuestionIdx];
                          const imageDesc = q.image ? `This question includes an image described as: ${q.accessibilityText || "a visual reference"}.` : "";
                          const text = `${imageDesc} ${q.text}. Option 1: ${q.options?.[0] || ""}. Option 2: ${q.options?.[1] || ""}. Option 3: ${q.options?.[2] || ""}. Option 4: ${q.options?.[3] || ""}.`;
                          speak(text);
                        }}
                        className="flex items-center gap-1.5 text-primary font-bold text-xs md:text-sm hover:underline active:scale-95 transition-transform"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-sm">volume_up</span>
                        Read Aloud (R)
                      </button>
                    </div>
                    <h2 className="text-lg md:text-xl font-bold leading-snug mb-4 text-slate-900 dark:text-slate-100">
                      {questions[currentQuestionIdx]?.text}
                    </h2>

                    {questions[currentQuestionIdx]?.image && (
                      <div className="mb-6">
                        <div className="flex justify-center mb-4">
                          <img
                            src={questions[currentQuestionIdx].image}
                            alt={questions[currentQuestionIdx].accessibilityText || "Visual reference for the question"}
                            className="max-h-72 w-auto rounded-3xl border-8 border-slate-100 dark:border-slate-800/50 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.2)] object-contain bg-white transition-all hover:scale-[1.02]"
                          />
                        </div >
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                          <button
                            onClick={() => setShowImageDesc(!showImageDesc)}
                            className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest mb-2 hover:underline"
                          >
                            <span className="material-symbols-outlined text-sm">{showImageDesc ? 'visibility_off' : 'visibility'}</span>
                            {showImageDesc ? 'Hide Asset Transcription' : 'Show Deep Transcription'}
                          </button>
                          {showImageDesc && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic animate-in slide-in-from-top-2 duration-300">
                              {questions[currentQuestionIdx].accessibilityText}
                            </p>
                          )}
                        </div>
                      </div >
                    )}
                    <div className="grid grid-cols-1 gap-2.5">
                      {questions[currentQuestionIdx]?.options?.map((option, idx) => {
                        const isSelected = selectedAnswers[currentQuestionIdx] === idx;
                        return (
                          <button
                            key={idx}
                            onClick={() => handleOptionSelect(idx)}
                            className={`group flex items-center text-left p-3 md:p-4 rounded-2xl border-2 transition-all focus:ring-4 focus:ring-primary focus:outline-none ${isSelected
                              ? "border-primary bg-primary/5"
                              : "border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-primary/5"
                              }`}
                            type="button"
                          >
                            <span
                              className={`flex-none w-10 h-10 flex items-center justify-center rounded-xl text-lg font-bold transition-colors mr-4 ${isSelected
                                ? "bg-primary text-white"
                                : "bg-slate-100 dark:bg-slate-800 group-hover:bg-primary group-hover:text-white"
                                }`}
                            >
                              {idx + 1}
                            </span>
                            <span className={`text-sm md:text-base ${isSelected ? "font-bold" : "font-medium"}`}>
                              {option}
                            </span>
                            {isSelected && (
                              <span className="ml-auto material-symbols-outlined text-primary text-2xl">
                                check_circle
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div >
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 md:p-5 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex gap-4">
                      <button
                        onClick={handlePrevious}
                        disabled={currentQuestionIdx === 0}
                        className={`flex items-center gap-2 px-6 py-4 rounded-xl font-bold text-lg transition-colors ${currentQuestionIdx === 0
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300"
                          }`}
                        type="button"
                      >
                        <span className="material-symbols-outlined">arrow_back</span>
                        Previous (P)
                      </button>
                      <button
                        onClick={handleNext}
                        disabled={currentQuestionIdx === questions.length - 1}
                        className={`flex items-center gap-2 px-6 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg ${currentQuestionIdx === questions.length - 1
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : "bg-primary text-white hover:bg-primary/90 shadow-primary/20"
                          }`}
                        type="button"
                      >
                        Next Question (N)
                        <span className="material-symbols-outlined">arrow_forward</span>
                      </button>
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={toggleMarkForReview}
                        className={`flex items-center gap-2 px-6 py-4 rounded-xl font-bold text-lg border-2 transition-all ${markedForReview[currentQuestionIdx]
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800"
                          }`}
                        type="button"
                      >
                        <span className="material-symbols-outlined">bookmark</span>
                        {markedForReview[currentQuestionIdx] ? "Marked" : "Review"} (M)
                      </button>
                      <button
                        className="flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-xl font-bold text-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
                        type="button"
                        onClick={handleSubmit}
                      >
                        Submit Exam (S)
                      </button>
                    </div>
                  </div>
                </div >
              </div >

              <aside className="lg:col-span-4 space-y-6">
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-6 sticky top-32">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">grid_view</span>
                    Question Palette
                  </h3>
                  <div className="grid grid-cols-5 gap-3 mb-8">
                    {questions.map((_, i) => {
                      const isCurrent = currentQuestionIdx === i;
                      const isAnswered = selectedAnswers[i] !== undefined;
                      const isMarked = markedForReview[i];

                      let bgColor = "bg-slate-100 dark:bg-slate-800";
                      let textColor = "text-slate-900 dark:text-slate-100";
                      let border = "";

                      if (isCurrent) {
                        border = "border-4 border-primary ring-2 ring-primary/20";
                        bgColor = "bg-primary/10";
                        textColor = "text-primary font-black";
                      } else if (isAnswered) {
                        bgColor = "bg-green-500";
                        textColor = "text-white";
                      } else if (isMarked) {
                        bgColor = "bg-orange-500";
                        textColor = "text-white";
                      }

                      return (
                        <button
                          key={i}
                          onClick={() => setCurrentQuestionIdx(i)}
                          className={`aspect-square flex items-center justify-center rounded-lg font-bold text-lg transition-all hover:scale-110 ${bgColor} ${textColor} ${border}`}
                          type="button"
                        >
                          {i + 1}
                        </button>
                      );
                    })}
                  </div>
                  <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-sm font-bold">
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded bg-green-500" />
                        Answered
                      </span>
                      <span>{Object.keys(selectedAnswers).length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-bold">
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded bg-orange-500" />
                        Marked for Review
                      </span>
                      <span>{Object.values(markedForReview).filter(Boolean).length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-bold">
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded bg-slate-200 dark:bg-slate-700" />
                        Not Visited
                      </span>
                      <span>{questions.length - Object.keys(selectedAnswers).length}</span>
                    </div>
                  </div>
                  <div className="mt-8 bg-primary/5 p-4 rounded-xl border border-primary/20">
                    <p className="text-sm font-bold text-primary uppercase tracking-tighter mb-2">
                      Keyboard Shortcuts
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between p-1 border-b border-primary/10">
                        <span>1-4</span>
                        <span className="font-black">Options</span>
                      </div>
                      <div className="flex justify-between p-1 border-b border-primary/10">
                        <span>N</span>
                        <span className="font-black">Next</span>
                      </div>
                      <div className="flex justify-between p-1 border-b border-primary/10">
                        <span>P</span>
                        <span className="font-black">Prev</span>
                      </div>
                      <div className="flex justify-between p-1 border-b border-primary/10">
                        <span>R</span>
                        <span className="font-black">Read</span>
                      </div>
                      <div className="flex justify-between p-1 border-b border-primary/10">
                        <span>S</span>
                        <span className="font-black">Submit</span>
                      </div>
                      <div className="flex justify-between p-1 border-b border-primary/10">
                        <span>M</span>
                        <span className="font-black">Mark</span>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            </>
          )}
        </main >

        <footer className="bg-white dark:bg-slate-900 border-t-2 border-slate-200 dark:border-slate-800 p-4 sticky bottom-0">
          <div className="max-w-[1400px] mx-auto flex items-center gap-6">
            <div className="flex-grow bg-slate-200 dark:bg-slate-700 h-4 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-500"
                style={{ width: `${(Object.keys(selectedAnswers).length / questions.length) * 100}%` }}
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={(Object.keys(selectedAnswers).length / questions.length) * 100}
              />
            </div>
            <span className="text-lg font-black text-primary">
              {Math.round((Object.keys(selectedAnswers).length / questions.length) * 100)}% COMPLETE
            </span>
          </div>
        </footer>

        {/* ARIA live for screen readers and voice status */}
        <div aria-live="polite" className="sr-only">
          {assistantStatus}
          {`Question ${currentQuestionIdx + 1} displayed.`}
          {isWarningOpen && `Warning ${warningCount}. Tab switching is not allowed during the exam.`}
        </div>

        {/* Warning Modal */}
        {
          isWarningOpen && (
            <div
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
              role="dialog"
              aria-modal="true"
              aria-labelledby="warning-title"
            >
              <div
                ref={dialogRef}
                tabIndex={-1}
                className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-primary/40 p-6 outline-none"
              >
                <h2
                  id="warning-title"
                  className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-orange-500">
                    warning
                  </span>
                  Exam Focus Warning
                </h2>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  Tab switching or leaving the exam window is not allowed. This is
                  warning {warningCount}. At 3 warnings, your exam will be
                  submitted automatically.
                </p>
                <button
                  type="button"
                  onClick={handleCloseWarning}
                  className="mt-2 w-full px-4 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 focus-visible"
                >
                  I Understand, Continue Exam
                </button>
              </div>
            </div>
          )
        }
      </div >
    </div >
  );
};

export default ExamPage;

