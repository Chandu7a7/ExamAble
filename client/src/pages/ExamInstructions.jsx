import React, { useCallback, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const ExamInstructions = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const examId = searchParams.get("id");
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (examId) {
      fetchExamDetails();
    }
  }, [examId]);

  const fetchExamDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/exams/${examId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setExam(data);
      }
    } catch (error) {
      console.error("Error fetching exam details:", error);
    } finally {
      setLoading(false);
    }
  };

  const enterFullscreen = useCallback(() => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  }, []);

  const handleStartExam = () => {
    enterFullscreen();
    navigate(`/exam?id=${examId}`);
  };

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
                aria-label="Audio Settings"
                className="flex items-center justify-center rounded-xl h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary hover:text-white transition-all active:scale-95"
                type="button"
              >
                <span className="material-symbols-outlined">volume_up</span>
              </button>
              <button
                aria-label="Contrast Settings"
                className="flex items-center justify-center rounded-xl h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary hover:text-white transition-all active:scale-95"
                type="button"
              >
                <span className="material-symbols-outlined">contrast</span>
              </button>
            </div>
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
              type="button"
            >
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-sm font-black">person</span>
              </div>
              <span className="text-sm font-black text-slate-700 dark:text-slate-300 hidden sm:inline uppercase tracking-widest">User 402</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-6 flex-grow py-12 relative z-10">
        <div className="mb-10">
          <div
            className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-[2rem] border-2 border-primary bg-primary/5 backdrop-blur-xl shadow-2xl shadow-primary/10 group"
            role="alert"
          >
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 animate-pulse">
                <span className="material-symbols-outlined text-3xl">settings_voice</span>
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1">Voice Protocol Synced</h2>
                <p className="text-slate-600 dark:text-slate-400 font-medium">
                  Status: Optimized for screen reading. Press <kbd className="bg-white dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 font-mono font-black text-primary mx-1">ENTER</kbd> to initiate session.
                </p>
              </div>
            </div>
            <button
              className="h-14 px-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-primary font-black rounded-xl hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center gap-2 group/btn"
              type="button"
            >
              AUDIO GUIDE
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>
        </div>

        <div className="mb-12">
          <p className="text-primary font-black uppercase tracking-[0.2em] text-sm mb-3">Examination Protocol</p>
          <h2 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
            {loading ? "Authenticating Batch..." : (exam?.title || "Standard Assessment")}
          </h2>
          <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl">
            Please synthesize the following parameters before committing to the examination state.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-xl border border-white/20">
              <div className="flex items-center gap-4 mb-10">
                <div className="h-12 w-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl font-black">info</span>
                </div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white">Exam Parameters</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { icon: "timer", label: "Session Time", value: loading ? "..." : `${exam?.duration || 0} MIN`, border: "border-primary" },
                  { icon: "quiz", label: "Item Count", value: loading ? "..." : `${exam?.questions?.length || 0} Q`, border: "border-blue-500" },
                  { icon: "cloud_done", label: "Sync Engine", value: "ACTIVE", border: "border-green-500", color: "text-green-500" }
                ].map((item, i) => (
                  <div key={i} className={`flex flex-col items-center p-8 rounded-[2rem] bg-slate-50/50 dark:bg-slate-800/50 border-b-8 ${item.border} transition-transform hover:-translate-y-2 duration-300 shadow-sm`}>
                    <span className="material-symbols-outlined text-4xl mb-4 text-slate-400">{item.icon}</span>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{item.label}</p>
                    <p className={`text-2xl font-black ${item.color || "text-slate-900 dark:text-white"}`}>{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-8 rounded-[2rem] bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <h4 className="text-xl font-black mb-6 flex items-center gap-3 text-slate-900 dark:text-white">
                  <span className="material-symbols-outlined text-primary font-black">notifications_active</span>
                  Telemetry & Persistence
                </h4>
                <div className="space-y-6">
                  <div className="flex gap-4 group">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black group-hover:bg-primary group-hover:text-white transition-all">1</div>
                    <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                      Precision audio alerts will trigger at <strong className="text-slate-900 dark:text-white">5:00</strong> and <strong className="text-slate-900 dark:text-white">1:00</strong> remaining marks.
                    </p>
                  </div>
                  <div className="flex gap-4 group">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black group-hover:bg-primary group-hover:text-white transition-all">2</div>
                    <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                      Automatic commitment protocol initiates exactly when the countdown hits <strong className="text-slate-900 dark:text-white">00:00:00</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-xl border border-white/20">
              <div className="flex items-center gap-4 mb-10">
                <div className="h-12 w-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl font-black">keyboard</span>
                </div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white">Operational Shortcuts</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { key: "N", label: "Advance" },
                  { key: "P", label: "Previous" },
                  { key: "R", label: "Narrate" },
                  { key: "S", label: "Finalize" }
                ].map((item) => (
                  <div key={item.key} className="flex flex-col items-center gap-4 p-6 border-2 border-slate-100 dark:border-slate-800 rounded-[1.5rem] hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group">
                    <kbd className="flex items-center justify-center w-16 h-16 text-3xl font-black bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-2xl shadow-[0_8px_0_0_#475569] dark:shadow-[0_8px_0_0_#94a3b8] group-hover:scale-110 transition-transform">
                      {item.key}
                    </kbd>
                    <span className="font-black text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400">{item.label}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <div className="bg-gradient-to-br from-primary to-primary-dark p-10 rounded-[2.5rem] shadow-2xl shadow-primary/30 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="h-16 w-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-8 border border-white/30 shadow-2xl">
                  <span className="material-symbols-outlined text-4xl">play_circle</span>
                </div>
                <h4 className="text-3xl font-black mb-4 leading-tight">Initialize Session</h4>
                <p className="text-blue-100 mb-10 font-medium text-lg leading-relaxed">
                  Isolation mode will be engaged. All telemetry will be actively logged.
                </p>
                <button
                  onClick={handleStartExam}
                  className="w-full h-20 bg-white text-primary font-black text-xl rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 group"
                  type="button"
                >
                  START EXAM
                  <span className="material-symbols-outlined text-3xl group-hover:translate-x-2 transition-transform">bolt</span>
                </button>
                <div className="mt-8 flex items-center gap-3 text-blue-100 font-bold text-sm">
                  <span className="material-symbols-outlined text-lg">verified_user</span>
                  SECURE ENVIRONMENT
                </div>
              </div>

              {/* Abstract Shapes */}
              <div className="absolute -right-10 -bottom-10 h-40 w-40 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -left-10 -top-10 h-32 w-32 bg-blue-400/20 rounded-full blur-2xl" />
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/20 shadow-lg">
              <h5 className="font-black text-xl text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary font-black">support_agent</span>
                Tactical Help
              </h5>
              <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed">
                Experience technical anomalies? Engaging <kbd className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg border text-primary font-black mx-1">F1</kbd> initiates priority backup.
              </p>
              <button
                className="w-full py-4 border-2 border-slate-100 dark:border-slate-800 rounded-xl text-sm font-black text-slate-500 dark:text-slate-400 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
                type="button"
              >
                <span className="material-symbols-outlined text-lg">analytics</span>
                RUN DIAGNOSTICS
              </button>
            </div>
          </aside>
        </div>
      </main>

      <footer className="w-full py-12 px-8 border-t border-white/10 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-slate-400 font-black text-xs tracking-widest uppercase">
          <p>© 2024 VI-Portal. Universal Academic Equity.</p>
          <div className="flex gap-10">
            <a className="hover:text-primary transition-colors" href="#">Privacy</a>
            <a className="hover:text-primary transition-colors" href="#">WCAG 2.1</a>
            <a className="hover:text-primary transition-colors" href="#">Handbook</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ExamInstructions;


