import API_BASE from "../../api.js";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || '{"name": "Student"}');
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const [examsRes, resultsRes] = await Promise.all([
        fetch(`${API_BASE}/api/exams`, {
          headers: { "Authorization": `Bearer ${token}` }
        }),
        fetch(`${API_BASE}/api/results/me`, {
          headers: { "Authorization": `Bearer ${token}` }
        })
      ]);

      const examsData = await examsRes.json();
      const resultsData = await resultsRes.json();

      if (examsRes.ok) setExams(examsData);
      if (resultsRes.ok) setResults(resultsData);
    } catch (error) {
      console.error("Error fetching student dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const now = new Date();
  const availableExams = exams.filter(e => new Date(e.startTime) <= now && new Date(e.endTime) >= now);
  const upcomingExams = exams.filter(e => new Date(e.startTime) > now);

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen selection:bg-primary/20">
      <div className="layout-container flex flex-col min-h-screen">
        <header className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-10 lg:px-40 py-3 shadow-sm">
          <div className="flex items-center justify-between gap-4 max-w-[1200px] mx-auto">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/")}>
              <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-xl">visibility</span>
              </div>
              <h2 className="text-xl font-black leading-tight tracking-tight text-primary">ExamAble</h2>
            </div>

            <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-8">
              <button
                onClick={() => navigate("/dashboard")}
                className="text-primary text-sm font-black border-b-2 border-primary pb-1 tracking-wide"
              >
                DASHBOARD
              </button>
              <button
                onClick={() => navigate("/profile")}
                className="text-slate-500 dark:text-slate-400 text-sm font-bold hover:text-primary transition-colors tracking-wide"
              >
                PROFILE
              </button>
              <button
                onClick={() => navigate("/result")}
                className="text-slate-500 dark:text-slate-400 text-sm font-bold hover:text-primary transition-colors tracking-wide"
              >
                RESULTS
              </button>
            </nav>

            <div className="flex items-center gap-3">
              <div aria-label="Accessibility Tools" className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button className="p-2 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-all text-slate-600 dark:text-slate-400">
                  <span className="material-symbols-outlined text-lg">accessibility_new</span>
                </button>
                <button className="p-2 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-all text-slate-600 dark:text-slate-400">
                  <span className="material-symbols-outlined text-lg">contrast</span>
                </button>
                <button className="p-2 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-all text-slate-600 dark:text-slate-400">
                  <span className="material-symbols-outlined text-lg">format_size</span>
                </button>
              </div>
              <div
                className="bg-primary/10 rounded-full p-0.5 border-2 border-primary cursor-pointer hover:scale-105 transition-transform"
                onClick={() => navigate("/profile")}
              >
                <img
                  alt="User Avatar"
                  className="size-8 rounded-full"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaq9XUsXJoAh5F9Aj6ZlaJ66AcvwyJBtirpBEaElZfSY42r7wO3eiBeGgM6c8k0gFxrqdM7hU0clEAcXLGWrzaY2glE3sK01tcJACHEdnnO0MMrE-T4yD3MiREA-zf9QLOBWBcl5FGxO-dkKTUmrXznP-aYcl47FjcQwbBWuKoKR9z0X9ReRz2rQKvZrKzKdxlnkU5LAPZpfvovV8W40jNfNDM27cRA6_tUeJGUcq9CudvBeXVngkBpJ72tuVUjWn-oovzjbmRyfI"
                />
              </div>
              <button
                onClick={handleLogout}
                className="hidden lg:block text-xs font-black text-slate-400 hover:text-primary transition-colors uppercase tracking-widest ml-2"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 md:px-10 lg:px-40 py-10 max-w-[1200px] mx-auto w-full">
          <section aria-labelledby="welcome-heading" className="mb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter" id="welcome-heading">
                  Welcome back, {user.name.split(" ")[0]}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-lg mt-2 font-medium">
                  {loading ? (
                    "Loading your assessment data..."
                  ) : (
                    <>
                      You have <span className="text-primary font-bold">{availableExams.length} available exams</span> scheduled for today.
                    </>
                  )}
                </p>
              </div>
              <div className="bg-primary/5 dark:bg-primary/10 border-l-4 border-primary p-5 rounded-2xl flex items-center gap-5 max-w-md shadow-sm backdrop-blur-sm group">
                <div className="relative">
                  <div className="size-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
                    <span className="material-symbols-outlined text-2xl animate-pulse">keyboard_voice</span>
                  </div>
                  <div className="absolute -top-1 -right-1 size-3.5 bg-green-500 rounded-full border-2 border-white dark:border-slate-900 shadow-sm"></div>
                </div>
                <div>
                  <p className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-1">Voice Protocol Active</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-bold">
                    Say <span className="underline decoration-primary/40 underline-offset-4">"Start Science Exam"</span> to begin.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section aria-labelledby="available-exams-title" className="mb-16">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="material-symbols-outlined text-primary font-bold">pending_actions</span>
              <h2 className="text-xl font-black uppercase tracking-[0.15em] text-slate-800 dark:text-slate-200" id="available-exams-title">Available Exams</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {loading ? (
                [1, 2].map((i) => (
                  <div key={i} className="h-64 bg-white dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800 animate-pulse" />
                ))
              ) : availableExams.length === 0 ? (
                <div className="lg:col-span-2 bg-white dark:bg-slate-800/50 p-12 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 text-center">
                  <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 font-light">history_edu</span>
                  <p className="text-xl font-bold text-slate-500 italic">No exams active at this timestamp.</p>
                </div>
              ) : (
                availableExams.map((exam) => (
                  <div key={exam._id} className="bg-white dark:bg-slate-800/50 p-7 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 hover:border-primary/50 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
                    <div className="flex justify-between items-start mb-6 relative z-10">
                      <div>
                        <h3 className="text-2xl font-black mb-2 text-slate-900 dark:text-white">{exam.title}</h3>
                        <div className="flex gap-5">
                          <span className="flex items-center gap-1.5 text-xs text-slate-500 font-black uppercase tracking-widest">
                            <span className="material-symbols-outlined text-sm text-primary">timer</span> {exam.duration} MINS
                          </span>
                          <span className="flex items-center gap-1.5 text-xs text-slate-500 font-black uppercase tracking-widest">
                            <span className="material-symbols-outlined text-sm text-primary">quiz</span> {exam.questions?.length || 0} ITEMS
                          </span>
                        </div>
                      </div>
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border border-green-200 dark:border-green-800">Open Now</span>
                    </div>
                    <div className="flex flex-col gap-4 relative z-10">
                      <button
                        onClick={() => navigate(`/exam/instructions?id=${exam._id}`)}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-black py-5 rounded-2xl shadow-xl shadow-primary/20 transition-all text-lg flex items-center justify-center gap-3 active:scale-[0.98]"
                      >
                        START EXAM
                        <span className="material-symbols-outlined font-bold">play_arrow</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section aria-labelledby="upcoming-exams-title" className="mb-16">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="material-symbols-outlined text-slate-400 font-bold">calendar_month</span>
              <h2 className="text-xl font-black uppercase tracking-[0.15em] text-slate-500" id="upcoming-exams-title">Upcoming Exams</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className="h-40 bg-slate-100/30 dark:bg-slate-800/20 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 animate-pulse" />
                ))
              ) : upcomingExams.length === 0 ? (
                <div className="md:col-span-2 lg:col-span-3 text-center py-10">
                  <p className="text-slate-400 font-bold italic">No upcoming sessions scheduled yet.</p>
                </div>
              ) : (
                upcomingExams.map((exam) => (
                  <div key={exam._id} className="bg-slate-100/30 dark:bg-slate-800/20 p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col justify-between group grayscale hover:grayscale-0 transition-all">
                    <div>
                      <h3 className="text-lg font-black mb-2 text-slate-700 dark:text-slate-300">{exam.title}</h3>
                      <p className="text-xs text-slate-500 font-bold flex items-center gap-2 mb-6">
                        <span className="material-symbols-outlined text-sm">event</span>
                        {new Date(exam.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} • {new Date(exam.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg uppercase tracking-tight">Scheduled</span>
                      <button className="bg-slate-200/50 dark:bg-slate-800/50 text-slate-400 font-black py-2 px-5 rounded-xl text-[10px] uppercase tracking-widest cursor-not-allowed">Locked</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section aria-labelledby="completed-exams-title" className="mb-12">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="material-symbols-outlined text-green-500 font-bold">task_alt</span>
              <h2 className="text-xl font-black uppercase tracking-[0.15em] text-slate-800 dark:text-slate-200" id="completed-exams-title">Recently Completed</h2>
            </div>
            <div className="space-y-4">
              {loading ? (
                [1, 2].map((i) => (
                  <div key={i} className="h-24 bg-white dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 animate-pulse" />
                ))
              ) : results.length === 0 ? (
                <div className="bg-white dark:bg-slate-800/40 p-10 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                  <p className="text-slate-400 font-bold italic">No examination history found.</p>
                </div>
              ) : (
                results.map((result) => (
                  <div key={result._id} className="bg-white dark:bg-slate-800/40 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center gap-6 hover:shadow-md transition-shadow">
                    <div className="size-14 bg-primary/5 rounded-2xl flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary text-2xl">terminal</span>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">{result.examId?.title || "Exam"}</h3>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Submitted on {new Date(result.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex flex-col md:items-end">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-2xl font-black text-slate-900 dark:text-white">{result.score} pts</span>
                      </div>
                      <button
                        onClick={() => navigate(`/result?id=${result._id}`)}
                        className="text-primary font-black text-[10px] uppercase tracking-widest hover:underline flex items-center gap-1 group"
                      >
                        VIEW DEEP ANALYSIS
                        <span className="material-symbols-outlined text-sm group-hover:translate-x-0.5 transition-transform">chevron_right</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </main>

        <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 py-8 px-4 backdrop-blur-md">
          <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-slate-400 font-bold text-[10px] uppercase tracking-[0.15em]">
            <p>© 2026 ExamAble Protocol. Accessibility-First Assessment.</p>
            <div className="flex gap-6">
              <a className="hover:text-primary transition-colors" href="#">Privacy</a>
              <a className="hover:text-primary transition-colors" href="#">Terms</a>
              <a className="hover:text-primary transition-colors" href="#">Accessibility</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default StudentDashboard;



