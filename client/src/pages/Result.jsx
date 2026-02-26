import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Result = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resultId = searchParams.get("id");
  const [result, setResult] = useState(null);
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (resultId) {
      fetchResultDetails();
    }
  }, [resultId]);

  const fetchResultDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/results/${resultId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setResult(data);
        // Fetch exam details to get total questions and title if not populated
        const examResponse = await fetch(`http://localhost:5000/api/exams/${data.examId?._id || data.examId}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const examData = await examResponse.json();
        if (examResponse.ok) {
          setExam(examData);
        }
      }
    } catch (error) {
      console.error("Error fetching result details:", error);
    } finally {
      setLoading(false);
    }
  };

  const percentage = exam && result ? Math.round((result.score / exam.questions.length) * 100) : 0;
  const incorrect = exam && result ? exam.questions.length - result.answers.length : 0; // Simplified logic, assuming result.answers.length is total attempted
  // Better logic: total questions - score (if each worth 1 mark)
  const correctCount = result?.score || 0;
  const totalQuestions = exam?.questions?.length || 0;
  const wrongCount = totalQuestions - correctCount;

  return (
    <div className="bg-background-light dark:bg-background-dark font-body text-slate-900 dark:text-slate-100 min-h-screen flex flex-col selection:bg-primary/30">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <header className="sticky top-0 z-50 w-full bg-white/70 dark:bg-background-dark/70 backdrop-blur-xl border-b border-white/10 px-6 md:px-12 py-4 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate("/")}>
            <div className="bg-gradient-to-br from-primary to-primary-dark p-2 rounded-xl text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined block text-xl">visibility</span>
            </div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              ExamAble
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-2 pr-4 border-r border-slate-200 dark:border-slate-800">
              <button
                className="flex items-center justify-center rounded-xl h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary hover:text-white transition-all active:scale-95"
                title="Toggle High Contrast"
                type="button"
              >
                <span className="material-symbols-outlined">contrast</span>
              </button>
              <button
                className="flex items-center justify-center rounded-xl h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary hover:text-white transition-all active:scale-95"
                title="Increase Font Size"
                type="button"
              >
                <span className="material-symbols-outlined">format_size</span>
              </button>
            </div>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark p-0.5 shadow-lg group cursor-pointer overflow-hidden">
              <img
                className="w-full h-full object-cover rounded-[10px]"
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                alt="Student profile avatar"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto w-full px-6 flex-grow py-12 relative z-10">
        <section
          aria-label="Voice Assistant Controls"
          className="mb-12 bg-slate-900 dark:bg-slate-950 text-white rounded-[2.5rem] p-8 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden group"
        >
          <div className="flex items-center gap-6 relative z-10">
            <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 relative">
              <div className="absolute inset-0 bg-primary/20 animate-ping rounded-2xl" />
              <span className="material-symbols-outlined text-primary text-3xl font-black">graphic_eq</span>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">Synthesized Feedback</p>
              <p className="text-xl font-medium text-slate-200 leading-relaxed">
                {loading ? "Synthesizing batch results..." : (
                  <>
                    "Assessment complete. You have achieved {percentage >= 80 ? <strong className="text-primary tracking-tight">Excellent Alignment</strong> : percentage >= 50 ? <strong className="text-blue-400 tracking-tight">System Proficiency</strong> : <strong className="text-red-400 tracking-tight">Requirement Gap</strong>} with target benchmarks."
                  </>
                )}
              </p>
            </div>
          </div>
          <button
            aria-label="Listen to the results again"
            className="h-16 px-10 bg-primary hover:bg-white text-white hover:text-primary font-black rounded-2xl transition-all flex items-center gap-3 active:scale-95 relative z-10 shadow-xl shadow-primary/20"
            type="button"
          >
            <span className="material-symbols-outlined text-2xl">volume_up</span>
            NARRATE AGAIN
          </button>

          {/* Decor */}
          <div className="absolute -right-20 -bottom-20 h-64 w-64 bg-primary/10 rounded-full blur-3xl" />
        </section>

        <article className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white/20 overflow-hidden group">
          <div className="p-10 md:p-16">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-6 py-2 rounded-full bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-green-500/20">
                Performance Optimized
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">
                {loading ? "Decrypting..." : (exam?.title || "Session Analysis")}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium uppercase text-xs tracking-widest">
                VERIFIED COMPLETION • {result ? new Date(result.submittedAt).toLocaleDateString() : "PENDING"}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div className="flex flex-col items-center justify-center p-12 bg-slate-50/50 dark:bg-slate-800/50 rounded-[3rem] border border-slate-100 dark:border-slate-800 relative group/score">
                <div
                  aria-label="Score chart: 90 percent"
                  className="relative size-64 flex items-center justify-center"
                >
                  <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                    <circle
                      className="stroke-slate-200 dark:stroke-slate-700"
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      strokeWidth="2.5"
                    />
                    <circle
                      className="stroke-primary transition-all duration-1000 ease-out"
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray={`${loading ? 0 : percentage}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-7xl font-black text-primary tracking-tighter">{loading ? "..." : `${percentage}%`}</span>
                    <span className="text-lg font-black text-slate-400">
                      {loading ? "---" : `${correctCount} / ${totalQuestions}`}
                    </span>
                  </div>
                </div>
                <div className="mt-10 text-center">
                  <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                    Tier: {percentage >= 90 ? "Expert" : percentage >= 75 ? "Distinction" : percentage >= 50 ? "Proficient" : "Novice"}
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xs">
                    Cognitive output efficiency: {percentage}% accuracy across {totalQuestions} nodes.
                  </p>
                </div>

                {/* Decoration */}
                <div className="absolute inset-0 bg-primary/5 rounded-[3rem] opacity-0 group-hover/score:opacity-100 transition-opacity" />
              </div>

              <div className="space-y-8">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-4">
                  Metrical Analysis
                </h3>
                <div className="space-y-4">
                  {[
                    { icon: "quiz", label: "Protocol Items", value: loading ? "..." : totalQuestions, color: "text-slate-400" },
                    { icon: "check_circle", label: "Precision Rate", value: loading ? "..." : `${correctCount} Hits`, color: "text-green-500", bg: "bg-green-500/10" },
                    { icon: "cancel", label: "Deviation", value: loading ? "..." : `${wrongCount} Items`, color: "text-red-500", bg: "bg-red-500/10" }
                  ].map((stat, i) => (
                    <div key={i} className={`flex items-center justify-between p-6 ${stat.bg || "bg-white dark:bg-slate-800"} rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm transition-transform hover:scale-[1.02]`}>
                      <div className="flex items-center gap-4">
                        <span className={`material-symbols-outlined ${stat.color} font-black`}>{stat.icon}</span>
                        <span className="text-sm font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{stat.label}</span>
                      </div>
                      <span className={`text-2xl font-black ${stat.color.includes('text-slate') ? 'text-slate-900 dark:text-white' : stat.color}`}>{stat.value}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 p-6 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-black text-slate-400 flex items-center gap-3 italic">
                    <span className="material-symbols-outlined text-primary text-sm font-black">info</span>
                    Efficiency: 42m duration utilized vs 60m threshold.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-20 flex flex-col md:flex-row items-center justify-center gap-6">
              <button
                aria-label="Download result as PDF"
                className="h-20 px-12 bg-primary text-white font-black text-xl rounded-[1.5rem] shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 group"
                type="button"
              >
                <span className="material-symbols-outlined text-3xl">picture_as_pdf</span>
                DOWNLOAD REPORT
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                aria-label="Return to your main dashboard"
                className="h-20 px-12 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white font-black text-xl rounded-[1.5rem] hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-4 active:scale-95"
                type="button"
              >
                <span className="material-symbols-outlined text-3xl">dashboard</span>
                GO TO CONSOLE
              </button>
            </div>
          </div>

          <div className="bg-slate-50/50 dark:bg-slate-950/50 px-10 py-8 flex items-center justify-center border-t border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
              <span className="material-symbols-outlined text-lg font-black text-primary">verified_user</span>
              Immutable Electronic Record • ExamPortal Secure Chain Verification
            </p>
          </div>
        </article>
      </main>

      <footer className="mt-16 pb-12 w-full px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-slate-400 font-black text-[10px] tracking-[0.2em] uppercase">
          <p>© 2024 VI-Portal. Cognitive Equity Benchmarking.</p>
          <div className="flex gap-10">
            <a className="hover:text-primary transition-colors" href="#">Legal</a>
            <a className="hover:text-primary transition-colors" href="#">WCAG 2.1</a>
            <a className="hover:text-primary transition-colors" href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Result;


