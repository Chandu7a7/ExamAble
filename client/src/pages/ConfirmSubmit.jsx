import API_BASE from "../api.js";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

/* ─── Speech Synthesis helper ─────────────────────────────────────────────── */
const speak = (text, onEnd) => {
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.95;
  utter.pitch = 1;
  utter.lang = "en-US";
  if (onEnd) utter.onend = onEnd;
  window.speechSynthesis.speak(utter);
};

/* ─── Voice commands config ────────────────────────────────────────────────── */
const SUBMIT_REGEX = /confirm|submit|final submit|yes submit|yes|confirm submission|submit exam/i;
const GOBACK_REGEX = /go back|back|return|review|review answers|back to exam|return to exam/i;

const ConfirmSubmit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("listening"); // listening | heard | submitting | goingback
  const [transcript, setTranscript] = useState("");
  const [bars] = useState(() => Array.from({ length: 5 }, (_, i) => i));

  const { examId, answers, timeUsed, totalQuestions } = location.state || {};

  /* refs so callbacks always get fresh values */
  const loadingRef = useRef(false);
  const recognitionRef = useRef(null);
  const isRunningRef = useRef(false);
  const cleanedUpRef = useRef(false);

  /* ── handleFinalSubmit ─────────────────────────────────────────────────── */
  const handleFinalSubmit = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    setVoiceStatus("submitting");

    /* stop mic during submit */
    if (recognitionRef.current && isRunningRef.current) {
      recognitionRef.current.stop();
    }

    speak("Submission successful. Your exam has been submitted.");

    try {
      const token = localStorage.getItem("token");
      const formattedAnswers = Object.entries(answers || {}).map(([idx, val]) => ({
        questionIndex: parseInt(idx),
        selectedOption: val,
      }));

      const response = await fetch(`${API_BASE}/api/results`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ examId, answers: formattedAnswers }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Exam submitted successfully!");
        navigate(`/result?id=${data._id}`);
      } else {
        toast.error(data.message || "Failed to submit exam.");
        loadingRef.current = false;
        setLoading(false);
        setVoiceStatus("listening");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error("Network error. Please try again.");
      loadingRef.current = false;
      setLoading(false);
      setVoiceStatus("listening");
    }
  }, [answers, examId, navigate]);

  /* ── goBackToExam ──────────────────────────────────────────────────────── */
  const goBackToExam = useCallback(() => {
    setVoiceStatus("goingback");
    speak("Returning to exam.", () => {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => { });
      }
      navigate(-1);
    });
  }, [navigate]);

  /* ── Voice Recognition setup ───────────────────────────────────────────── */
  useEffect(() => {
    if (!examId || !answers) {
      toast.error("Invalid session data. Returning to dashboard.");
      navigate("/dashboard");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    const startRecognition = () => {
      if (cleanedUpRef.current || isRunningRef.current) return;
      try {
        recognition.start();
        isRunningRef.current = true;
      } catch (_) { }
    };

    recognition.onresult = (event) => {
      const raw = Array.from(event.results)
        .slice(event.resultIndex)
        .map((r) => r[0].transcript.trim().toLowerCase())
        .join(" ");

      if (!raw || loadingRef.current) return;
      setTranscript(raw);
      setVoiceStatus("heard");

      if (SUBMIT_REGEX.test(raw)) {
        handleFinalSubmit();
      } else if (GOBACK_REGEX.test(raw)) {
        goBackToExam();
      } else {
        // unknown command — reset
        setTimeout(() => {
          setTranscript("");
          setVoiceStatus("listening");
        }, 1500);
      }
    };

    recognition.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") return;
      isRunningRef.current = false;
    };

    recognition.onend = () => {
      isRunningRef.current = false;
      if (!cleanedUpRef.current && !loadingRef.current) {
        setTimeout(startRecognition, 300);
      }
    };

    /* Intro speech → then start mic */
    speak(
      "You have reached the end of your exam. Say confirm submission to submit, or say go back to exam to review your answers.",
      () => { startRecognition(); }
    );

    return () => {
      cleanedUpRef.current = true;
      window.speechSynthesis.cancel();
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      if (isRunningRef.current) {
        try { recognition.stop(); } catch (_) { }
      }
    };
  }, []); // eslint-disable-line — intentionally run once

  /* ── Keyboard shortcuts ────────────────────────────────────────────────── */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Enter" && !loading) handleFinalSubmit();
      if (e.key === "Escape" && !loading) goBackToExam();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [loading, handleFinalSubmit, goBackToExam]);

  /* ── Status labels ─────────────────────────────────────────────────────── */
  const statusConfig = {
    listening: { label: "Listening for voice command...", color: "text-primary", barColor: "bg-primary" },
    heard: { label: `Heard: "${transcript}"`, color: "text-emerald-400", barColor: "bg-emerald-400" },
    submitting: { label: "Submitting your exam...", color: "text-amber-400", barColor: "bg-amber-400" },
    goingback: { label: "Returning to exam...", color: "text-blue-400", barColor: "bg-blue-400" },
  };
  const status = statusConfig[voiceStatus] || statusConfig.listening;

  return (
    <div className="bg-slate-50 dark:bg-slate-950 font-display text-slate-900 dark:text-slate-100 min-h-screen relative overflow-hidden flex items-center justify-center p-4">

      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{ backgroundImage: "radial-gradient(#4f46e5 0.5px, transparent 0.5px)", backgroundSize: "24px 24px" }} />
      </div>

      {/* Blurred BG preview */}
      <div className="absolute inset-0 z-0 opacity-20 dark:opacity-10 scale-105 blur-2xl pointer-events-none rotate-1">
        <div className="h-full w-full bg-white dark:bg-slate-900 flex flex-col p-12 gap-8">
          <div className="h-16 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="flex gap-8 flex-1">
            <div className="flex-[2] space-y-6">
              <div className="h-48 w-full bg-slate-100 dark:bg-slate-800 rounded-3xl" />
              <div className="h-24 w-full bg-slate-100 dark:bg-slate-800 rounded-3xl" />
            </div>
            <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 rounded-3xl" />
          </div>
        </div>
      </div>

      {/* Main card */}
      <div className="relative z-10 w-full max-w-2xl">

        {/* ── Voice Visualizer ── */}
        <div className="mb-6 flex justify-center">
          <div className="bg-slate-900/90 dark:bg-white/10 backdrop-blur-2xl border border-white/10 rounded-full px-6 py-3 shadow-2xl flex items-center gap-4 min-w-[260px]">
            {/* animated bars */}
            <div className="flex gap-[3px] items-end h-5">
              {bars.map((i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-300 ${status.barColor} ${voiceStatus === "listening"
                      ? "animate-bounce"
                      : voiceStatus === "heard"
                        ? "animate-pulse"
                        : ""
                    }`}
                  style={{
                    height: voiceStatus === "listening"
                      ? `${40 + i * 12}%`
                      : voiceStatus === "heard"
                        ? "100%"
                        : "30%",
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>

            {/* mic icon */}
            <span className={`material-symbols-outlined text-lg ${status.color}`}>
              {voiceStatus === "submitting" ? "cloud_upload" :
                voiceStatus === "goingback" ? "arrow_back" :
                  voiceStatus === "heard" ? "check_circle" : "mic"}
            </span>

            <p className={`text-xs font-bold uppercase tracking-widest ${status.color} truncate max-w-[180px]`}>
              {status.label}
            </p>
          </div>
        </div>

        {/* ── Card ── */}
        <div className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] border border-white dark:border-white/10 overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-br from-primary to-indigo-700 p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="relative z-10 flex items-center gap-6">
              <div className="size-16 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-inner">
                <span className="material-symbols-outlined text-4xl font-black">lock_person</span>
              </div>
              <div>
                <h2 className="text-4xl font-black tracking-tighter mb-1">Finish Exam?</h2>
                <div className="flex items-center gap-2 opacity-80 uppercase text-[10px] font-bold tracking-[0.2em]">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Final Checkpoint • Secure Submission
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-10 md:p-14">
            <p className="text-2xl font-bold text-slate-700 dark:text-slate-200 leading-tight mb-10">
              You've reached the end of your session. Once submitted, your responses will be{" "}
              <span className="text-primary underline decoration-primary/30 underline-offset-4">finalized and locked</span>.
            </p>

            {/* ── Voice command hints ── */}
            <div className="mb-10 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4">
                <span className="material-symbols-outlined text-emerald-500 text-xl shrink-0">mic</span>
                <div>
                  <p className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-widest mb-0.5">Say to Submit</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">"Confirm submission"</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4">
                <span className="material-symbols-outlined text-blue-500 text-xl shrink-0">mic</span>
                <div>
                  <p className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-widest mb-0.5">Say to Go Back</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">"Go back to exam"</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 mb-12">
              <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/50 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-primary text-xl">checklist</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">
                    {Object.keys(answers || {}).length}/{totalQuestions || 0}
                  </span>
                  <span className="text-xs font-bold text-slate-400">Questions</span>
                </div>
                <div className="mt-3 h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all"
                    style={{ width: `${(Object.keys(answers || {}).length / (totalQuestions || 1)) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/50 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-orange-500 text-xl">schedule</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Used</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">
                    {Math.floor((timeUsed || 0) / 60)}:{((timeUsed || 0) % 60).toString().padStart(2, "0")}
                  </span>
                  <span className="text-xs font-bold text-slate-400">Mins</span>
                </div>
                <div className="mt-3 h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 w-full" />
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-4">
              <button
                disabled={loading}
                onClick={handleFinalSubmit}
                className="group relative h-20 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white rounded-3xl text-xl font-black shadow-[0_20px_50px_-10px_rgba(79,70,229,0.5)] transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-6"
                type="button"
              >
                {loading ? (
                  <div className="size-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="material-symbols-outlined text-2xl group-hover:translate-x-1 transition-transform">send</span>
                    CONFIRM SUBMISSION
                    <div className="hidden sm:flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-xl border border-white/20 text-[10px] gap-2">
                      <span className="material-symbols-outlined text-xs">mic</span>
                      <span className="font-black">or ENTER</span>
                    </div>
                  </>
                )}
              </button>

              <button
                disabled={loading}
                onClick={goBackToExam}
                className="group h-20 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-3xl text-xl font-bold transition-all flex items-center justify-center gap-6 border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700 disabled:opacity-50"
                type="button"
              >
                <span className="material-symbols-outlined text-2xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
                GO BACK TO EXAM
                <div className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-[10px] gap-2">
                  <span className="material-symbols-outlined text-xs">mic</span>
                  <span className="font-black italic">or ESC</span>
                </div>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-50/50 dark:bg-slate-950/30 px-10 py-6 border-t border-slate-100 dark:border-white/5 flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Identity Verified</span>
            </div>
            <div className="flex gap-6">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200 dark:border-slate-800 pr-6">Encrypted: AES-256</span>
              <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Safe Zone Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmSubmit;
