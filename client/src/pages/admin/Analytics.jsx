import React from "react";
import AdminSidebar from "../../components/admin/AdminSidebar.jsx";

const Analytics = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex selection:bg-primary/30">
      <AdminSidebar />

      <main className="flex-1 flex flex-col min-w-0 bg-background-light dark:bg-background-dark overflow-y-auto">
        {/* Header */}
        <header className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl px-10 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <span className="material-symbols-outlined text-2xl font-black">bar_chart_4_bars</span>
            </div>
            <h2 className="text-xl font-black tracking-tight uppercase italic">Advanced Analytics</h2>
          </div>
          <div className="flex items-center gap-2 px-6 py-2 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="size-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Real-time Telemetry</span>
          </div>
        </header>

        <div className="p-12 max-w-[1400px] mx-auto w-full space-y-16 animate-in fade-in slide-in-from-bottom duration-700">
          <header className="space-y-4">
            <div className="inline-flex items-center px-4 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] border border-primary/20">
              Cognitive Telemetry
            </div>
            <h1 className="text-6xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
              Inclusion <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent italic">Insights</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xl font-medium max-w-2xl border-l-4 border-primary pl-6 py-1 italic">
              Analyzing student interaction patterns with adaptive protocols. Optimizing the exam environment for diverse cognitive inputs.
            </p>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { label: "Voice Interactions", value: "68%", icon: "record_voice_over", color: "from-primary to-blue-500", desc: "Sessions utilizing auditory commands" },
              { label: "Matrix Key-Nav", value: "42%", icon: "keyboard", color: "from-blue-500 to-indigo-600", desc: "Non-pointer based interaction sessions" },
              { label: "Optical Contrast", value: "55%", icon: "contrast", color: "from-indigo-600 to-primary-dark", desc: "High-contrast visual mode activations" }
            ].map((metric, i) => (
              <div
                key={i}
                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-800 p-10 transition-all hover:scale-[1.03] group"
              >
                <div className={`size-16 rounded-2xl bg-gradient-to-br ${metric.color} text-white flex items-center justify-center mb-8 shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform`}>
                  <span className="material-symbols-outlined text-3xl font-black">{metric.icon}</span>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">
                  {metric.label}
                </p>
                <div className="flex items-baseline gap-3">
                  <p className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums">{metric.value}</p>
                  <span className="material-symbols-outlined text-green-500 text-xl font-black animate-bounce">trending_up</span>
                </div>
                <p className="mt-6 text-[11px] font-bold text-slate-500 leading-relaxed uppercase tracking-widest italic opacity-70">
                  {metric.desc}
                </p>
                <div className="mt-10 h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                  <div
                    className={`h-full bg-gradient-to-r ${metric.color} rounded-full transition-all duration-1000`}
                    style={{ width: metric.value }}
                  />
                </div>
              </div>
            ))}
          </section>

          <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[4rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden p-14">
            <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-16">
              <div className="space-y-3">
                <h2 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">Engagement Distribution</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Temporal mapping of accessibility tool utilization across sessions.</p>
              </div>
              <div className="flex gap-4">
                <button className="px-8 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-primary/5 transition-all">Previous Phase</button>
                <button className="px-8 py-3 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/30 hover:scale-[1.05] transition-all">Current Node</button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-6 h-64 items-end px-4">
              {[60, 45, 80, 55, 90, 70, 85].map((h, i) => (
                <div key={i} className="flex flex-col items-center gap-4 group">
                  <div
                    className="w-full rounded-t-[1.5rem] bg-gradient-to-b from-primary/40 to-primary/5 group-hover:from-primary group-hover:to-primary/50 transition-all border-x-2 border-t-2 border-primary/20 cursor-help relative shadow-lg"
                    style={{ height: `${h}%` }}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity uppercase whitespace-nowrap">{h}% LOAD</div>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest tracking-tighter">PHASE {i + 1}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; }
      `}} />
    </div>
  );
};

export default Analytics;
