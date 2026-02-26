import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const ConfirmSubmit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { examId, answers, timeUsed, totalQuestions } = location.state || {};

  useEffect(() => {
    if (!examId || !answers) {
      toast.error("Invalid session data. Returning to dashboard.");
      navigate("/dashboard");
    }
  }, [examId, answers, navigate]);

  const handleFinalSubmit = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Transform selectedAnswers {idx: val} to expected backend format [{questionIndex, selectedOption}]
      const formattedAnswers = Object.entries(answers).map(([idx, val]) => ({
        questionIndex: parseInt(idx),
        selectedOption: val
      }));

      const response = await fetch("http://localhost:5000/api/results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          examId,
          answers: formattedAnswers
        })
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Exam submitted successfully!");
        navigate(`/result?id=${data._id}`);
      } else {
        toast.error(data.message || "Failed to submit exam.");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && !loading) {
        handleFinalSubmit();
      } else if (e.key === "Escape") {
        navigate(-1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, loading]);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 font-display text-slate-900 dark:text-slate-100 min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{ backgroundImage: 'radial-gradient(#4f46e5 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
      </div>

      {/* Blurred Background Preview (Simulating the Exam Page) */}
      <div className="absolute inset-0 z-0 opacity-20 dark:opacity-10 scale-105 blur-2xl pointer-events-none rotate-1">
        <div className="h-full w-full bg-white dark:bg-slate-900 flex flex-col p-12 gap-8">
          <div className="h-16 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="flex gap-8 flex-1">
            <div className="flex-[2] space-y-6">
              <div className="h-48 w-full bg-slate-100 dark:bg-slate-800 rounded-3xl" />
              <div className="h-24 w-full bg-slate-100 dark:bg-slate-800 rounded-3xl" />
              <div className="h-24 w-full bg-slate-100 dark:bg-slate-800 rounded-3xl" />
            </div>
            <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 rounded-3xl" />
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-2xl transform transition-all duration-700 animate-in fade-in slide-in-from-bottom-8">

        {/* Voice Assistant Visualizer */}
        <div className="mb-8 flex justify-center">
          <div className="bg-slate-900/90 dark:bg-white/10 backdrop-blur-2xl border border-white/10 dark:border-white/5 rounded-full px-6 py-3 shadow-2xl flex items-center gap-4">
            <div className="flex gap-1 items-center h-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-1 bg-primary rounded-full animate-bounce"
                  style={{ height: `${20 + Math.random() * 80}%`, animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
            <p className="text-xs font-bold text-slate-300 dark:text-slate-100 uppercase tracking-widest">
              Awaiting Voice Approval...
            </p>
          </div>
        </div>

        {/* The Confirmation Card */}
        <div className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] border border-white dark:border-white/10 overflow-hidden">

          {/* Header Section */}
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

          {/* Body Section */}
          <div className="p-10 md:p-14">
            <p className="text-2xl font-bold text-slate-700 dark:text-slate-200 leading-tight mb-10">
              You've reached the end of your session. Once submitted, your responses will be <span className="text-primary underline decoration-primary/30 underline-offset-4">finalized and locked</span>.
            </p>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-6 mb-12">
              <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/50 group hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-primary text-xl">checklist</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">
                    {Object.keys(answers || {}).length}/{totalQuestions || 0}
                  </span>
                  <span className="text-xs font-bold text-slate-400">Items</span>
                </div>
                <div className="mt-3 h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all"
                    style={{ width: `${(Object.keys(answers || {}).length / (totalQuestions || 1)) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/50 group hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-orange-500 text-xl">schedule</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Used</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">
                    {Math.floor((timeUsed || 0) / 60)}:{(timeUsed % 60 || 0).toString().padStart(2, "0")}
                  </span>
                  <span className="text-xs font-bold text-slate-400">Mins</span>
                </div>
                <div className="mt-3 h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 w-[100%]" />
                </div>
              </div>
            </div>

            {/* Actions */}
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
                    <div className="hidden sm:flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/20 text-[10px]">
                      <span className="font-black">ENTER</span>
                    </div>
                  </>
                )}
              </button>

              <button
                disabled={loading}
                onClick={() => {
                  if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen().catch(() => { });
                  }
                  navigate(-1);
                }}
                className="group h-20 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-3xl text-xl font-bold transition-all flex items-center justify-center gap-6 border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700 disabled:opacity-50"
                type="button"
              >
                <span className="material-symbols-outlined text-2xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
                GO BACK TO EXAM
                <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-[10px]">
                  <span className="font-black italic">ESC</span>
                </div>
              </button>
            </div>
          </div>

          {/* Footer Metadata */}
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


