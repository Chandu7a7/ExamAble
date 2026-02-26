import API_BASE from "../../api.js";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar.jsx";


const AdminDashboard = () => {
  const navigate = useNavigate();
  const [showVoiceBanner, setShowVoiceBanner] = useState(true);
  const [adminName, setAdminName] = useState("Admin User");
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalStudents: 0,
      totalExams: 0,
      activeExams: 0,
      completedExams: 0,
      violations: 0
    },
    activeExams: [],
    recentActivities: []
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.name) {
      setAdminName(user.name);
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/api/admin/stats`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setDashboardData(data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased min-h-screen selection:bg-primary/30">
      <div className="flex min-h-screen flex-col">
        {/* Top Navigation */}
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-4 md:px-10 py-3 shadow-sm transition-all">
          <div className="max-w-[1600px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div
                aria-label="VI-Exam Admin Home"
                className="flex items-center gap-3 text-primary focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-1 cursor-pointer transition-transform hover:scale-[1.02] group"
                role="banner"
                onClick={() => navigate("/")}
              >
                <div className="bg-gradient-to-br from-primary to-primary-dark p-2 rounded-xl text-white shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
                  <span aria-hidden="true" className="material-symbols-outlined text-2xl font-bold block">visibility</span>
                </div>
                <h2 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic decoration-primary underline decoration-2 underline-offset-4">ExamAble Admin</h2>
              </div>
              <nav aria-label="Global accessibility controls" className="hidden lg:flex items-center gap-2">
                <button aria-pressed="false" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest hover:bg-primary/20 transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-primary">
                  <span aria-hidden="true" className="material-symbols-outlined text-[18px]">settings_accessibility</span>
                  <span>Accessibility Engine</span>
                </button>
              </nav>
            </div>

            <div className="flex flex-1 justify-end items-center gap-4 lg:gap-6">
              <div className="relative hidden sm:block w-full max-w-xs" role="search">
                <label className="sr-only" htmlFor="search-input">Search exams or students</label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">search</span>
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-2.5 border-none bg-slate-100 dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-primary text-sm font-medium placeholder-slate-500 transition-all dark:text-white"
                  id="search-input"
                  placeholder="Search Portal Metrics..."
                  type="text"
                />
              </div>

              <div className="flex items-center gap-2">
                <button aria-label="Notifications, 3 new" className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-all active:scale-90 relative">
                  <span className="material-symbols-outlined text-[24px]">notifications</span>
                  <span className="absolute top-2.5 right-2.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-background-dark animate-pulse"></span>
                </button>

                <div className="h-10 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2" />

                <button aria-expanded="false" aria-haspopup="true" className="flex items-center gap-3 p-1.5 pr-4 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95 group border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                  <div className="size-9 rounded-full bg-primary text-white flex items-center justify-center overflow-hidden shadow-lg group-hover:rotate-12 transition-transform">
                    <span className="material-symbols-outlined font-black">shield_person</span>
                  </div>
                  <div className="hidden md:flex flex-col items-start translate-y-0.5">
                    <span className="text-xs font-black leading-none uppercase tracking-tighter text-slate-900 dark:text-white">{adminName}</span>
                    <span className="text-[10px] text-primary font-black uppercase tracking-widest mt-1 opacity-70">Administrator</span>
                  </div>
                  <span className="material-symbols-outlined text-sm text-slate-400">expand_more</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden h-[calc(100vh-68px)]">
          {/* Sidebar */}
          <AdminSidebar />


          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-6 md:p-12 bg-background-light dark:bg-background-dark custom-scrollbar space-y-12">

            {showVoiceBanner && (
              <div aria-live="polite" className="p-8 rounded-[2.5rem] bg-gradient-to-r from-primary to-primary-dark text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-primary/30 border border-white/10 animate-in fade-in slide-in-from-top duration-700" role="alert">
                <div className="flex items-center gap-5">
                  <div className="size-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner group transition-transform hover:rotate-6">
                    <span className="material-symbols-outlined text-3xl animate-pulse">record_voice_over</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight leading-none mb-2 italic underline decoration-white/30 decoration-2 underline-offset-4">Audio Oversight Enabled</h3>
                    <p className="text-white/70 font-bold uppercase tracking-widest text-xs">Vocalizing dashboard telemetry for high-tier integrity monitoring.</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowVoiceBanner(false)}
                  className="px-8 py-3 bg-white text-primary font-black rounded-2xl hover:bg-slate-100 transition-all active:scale-95 text-xs uppercase tracking-widest shadow-xl shadow-black/10"
                >
                  Silence Guidance
                </button>
              </div>
            )}

            <div className="max-w-[1400px] mx-auto space-y-16">
              {/* Dashboard Header */}
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] border border-primary/20">
                  Global Oversight
                </div>
                <h1 className="text-6xl font-black tracking-tighter text-slate-900 dark:text-slate-100 leading-none">
                  Operations Hub
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-xl font-medium max-w-2xl border-l-4 border-primary pl-6 py-1 italic">
                  Advanced telemetry and accessibility-first proctoring benchmarks.
                </p>
              </div>

              {/* Stats Grid */}
              <div aria-label="Key Performance Indicators" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6" role="list">
                {[
                  { label: "Total Students", value: dashboardData.stats.totalStudents.toLocaleString(), change: "+0%", color: "bg-primary", width: "100%" },
                  { label: "Total Exams", value: dashboardData.stats.totalExams.toLocaleString(), change: "+0%", color: "bg-primary", width: "100%" },
                  { label: "Active Exams", value: dashboardData.stats.activeExams.toLocaleString(), change: "+0%", color: "bg-orange-500", width: "100%" },
                  { label: "Completed", value: dashboardData.stats.completedExams.toLocaleString(), change: "+0%", color: "bg-green-500", width: "100%" },
                  { label: "Violations", value: dashboardData.stats.violations.toLocaleString(), change: "+0%", color: "bg-red-500", width: "100%" },
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col gap-4 rounded-3xl bg-white dark:bg-slate-900 p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 hover:border-primary transition-all hover:-translate-y-2 group" role="listitem" tabIndex="0">
                    <span className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">{stat.value}</span>
                      <span className={`text-[10px] font-black ${stat.change.startsWith('+') ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'} px-2 py-1 rounded-lg`}>{stat.change}</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                      <div className={`h-full rounded-full transition-all duration-1000 group-hover:bg-primary ${stat.color}`} style={{ width: stat.width }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 pt-8">
                {/* Active Exams Overview */}
                <div className="xl:col-span-2 space-y-8">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100 italic tracking-tighter flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-4xl">live_tv</span>
                      Real-Time Sessions
                    </h3>
                    <button className="text-primary font-black text-xs uppercase tracking-widest hover:underline decoration-2 underline-offset-8">Global Live Stream</button>
                  </div>

                  <div className="rounded-[3rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden p-2">
                    <div className="overflow-x-auto">
                      <table aria-label="Table of ongoing exams" className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 dark:border-slate-800">
                            <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Deployment Identity</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Capacity</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Timeframe</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] text-right">Module Control</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                          {dashboardData.activeExams.length > 0 ? (
                            dashboardData.activeExams.map((exam, i) => (
                              <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all cursor-default">
                                <td className="px-8 py-7">
                                  <div className="space-y-1">
                                    <p className="font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors text-lg tracking-tight italic">{exam.title}</p>
                                    <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest opacity-60">
                                      <span className="material-symbols-outlined text-xs">analytics</span>
                                      {exam.usage}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-8 py-7 font-bold text-slate-500 dark:text-slate-400 text-sm">{exam.students}</td>
                                <td className="px-8 py-7">
                                  <span className="font-black font-mono text-red-500 bg-red-500/10 px-3 py-1.5 rounded-xl text-xs">
                                    {new Date(exam.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </td>
                                <td className="px-8 py-7 text-right">
                                  <button aria-label={`Monitor ${exam.title}`} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-primary text-slate-400 hover:text-white transition-all active:scale-90 group-hover:shadow-lg group-hover:shadow-primary/20">
                                    <span className="material-symbols-outlined font-black">visibility</span>
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" className="px-8 py-10 text-center text-slate-400 font-bold italic">
                                No active exam sessions at this moment.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Recent Activity List */}
                <div className="space-y-8">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100 italic tracking-tighter flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-4xl">history</span>
                      Audit Log
                    </h3>
                  </div>
                  <div aria-label="List of student actions" className="flex flex-col gap-4" role="list">
                    {dashboardData.recentActivities.length > 0 ? (
                      dashboardData.recentActivities.map((activity, i) => (
                        <div key={i} className="p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/30 dark:shadow-none transition-all hover:scale-[1.03] hover:border-primary group cursor-default" role="listitem" tabIndex="0">
                          <div className="flex gap-5">
                            <div className={`size-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all`}>
                              <span className={`material-symbols-outlined text-primary group-hover:text-white transition-colors`}>{activity.icon}</span>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">{activity.user}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold leading-tight">{activity.action}</p>
                              <p className="text-[9px] text-primary font-black uppercase tracking-[0.2em] pt-2">{new Date(activity.time).toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-10 text-center text-slate-400 font-bold italic bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                        No recent activity recorded.
                      </div>
                    )}
                    <button className="w-full mt-4 py-6 text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:border-primary hover:text-primary transition-all active:scale-95 shadow-inner">
                      Access Deep Forensic Logs
                    </button>
                  </div>
                </div>
              </div>

              {/* Keyboard Navigation Instructions */}
              <div className="pt-20 pb-12 text-center">
                <div className="inline-flex flex-col items-center gap-4">
                  <div className="h-10 w-[2px] bg-gradient-to-b from-primary to-transparent" />
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] font-black leading-relaxed">
                    Accessibility Core: <kbd className="bg-white dark:bg-slate-800 px-3 py-1 rounded-lg shadow-md text-primary ring-1 ring-slate-200 dark:ring-slate-700 italic mx-1 font-black underline decoration-primary/30 underline-offset-4">Tab</kbd> to iterate hub widgets.
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }
        .animate-pulse-slow { animation: pulse-slow 3s infinite ease-in-out; }
      `}} />
    </div>
  );
};

export default AdminDashboard;
