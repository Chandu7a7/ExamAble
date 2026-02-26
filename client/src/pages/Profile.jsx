import API_BASE from "../../api.js";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [activeVoice, setActiveVoice] = useState(true);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // Fetch User Profile
        const userRes = await fetch(`${API_BASE}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        } else {
          // Handle error, e.g., token expired
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }

        // Fetch Results
        const resultsRes = await fetch(`${API_BASE}/api/results/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (resultsRes.ok) {
          const resultsData = await resultsRes.json();
          setResults(resultsData);
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
        // Optionally handle network errors or other issues
        // For now, just log and proceed to set loading to false
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-xl font-bold text-primary">Loading Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen selection:bg-primary/20">
      <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-primary/10 shadow-sm backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/")}>
              <div className="bg-primary text-white p-2 rounded-xl shadow-lg shadow-primary/20 group-hover:scale-105 transition-all">
                <span className="material-symbols-outlined text-2xl">visibility</span>
              </div>
              <h1 className="text-2xl font-black tracking-tighter text-primary">ExamAble</h1>
            </div>

            <nav aria-label="Main Navigation" className="hidden md:flex items-center space-x-10">
              <button
                onClick={() => navigate("/dashboard")}
                className="text-slate-500 dark:text-slate-400 hover:text-primary font-bold py-2 transition-colors uppercase tracking-widest text-xs"
              >
                Dashboard
              </button>
              <button
                className="text-primary border-b-4 border-primary font-black py-2 uppercase tracking-widest text-xs"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="text-slate-500 dark:text-slate-400 hover:text-primary font-bold py-2 transition-colors uppercase tracking-widest text-xs"
              >
                Logout
              </button>
            </nav>

            <div className="flex items-center gap-4">
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-500 dark:text-slate-400">
                  <span className="material-symbols-outlined text-lg">format_size</span>
                </button>
                <button className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-500 dark:text-slate-400">
                  <span className="material-symbols-outlined text-lg">contrast</span>
                </button>
                <button className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-500 dark:text-slate-400">
                  <span className="material-symbols-outlined text-lg">accessibility_new</span>
                </button>
              </div>
              <div className="size-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center overflow-hidden cursor-pointer hover:scale-105 transition-transform shadow-md shadow-primary/10">
                <img
                  alt="Student profile"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-ZCzM_5Tj1qzOhbFNI3mw2TXxUSm9AvmxH9eKkDUxJH7znHthTLYHDfQ7pDeoGKfwhiFRMflkcMXIKeySXc0c6R2VyIQhhrczl8IWDyQxaRghU9tLsPNVJkgn1RqB6DIKtUWTEfzUwvG8UsqlNohrzpu0TxZ6dCVciqkKJAQtCw5k0sprJtW5wf9H2AQNIu6zBp8ZJLZYvYDvSWibgh-aaiP5745p6lAVBUsL1XiMOOr3d5uPTQa9Gta41daUNGHHHvJB_2x2nOQ"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {activeVoice && (
          <section className="mb-10 bg-primary/5 dark:bg-primary/10 border-l-[6px] border-primary rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm group animate-in slide-in-from-top duration-500" role="alert">
            <div className="flex items-center gap-5">
              <div className="size-12 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 animate-pulse">
                <span className="material-symbols-outlined text-2xl font-bold">keyboard_voice</span>
              </div>
              <div>
                <h2 className="text-xl font-black text-primary uppercase tracking-tight">Voice Assistant Active</h2>
                <p className="text-slate-600 dark:text-slate-300 font-bold mt-0.5">Welcome to your profile. All settings will be announced via your audio interface.</p>
              </div>
            </div>
            <button
              onClick={() => setActiveVoice(false)}
              className="w-full md:w-auto px-8 py-3.5 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-blue-800 transition-all active:scale-95 shadow-md shadow-primary/20"
            >
              Dismiss Protocol
            </button>
          </section>
        )}

        <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 mb-10 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-700"></div>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10 relative z-10">
            <div className="relative">
              <div className="size-40 rounded-3xl bg-primary/5 flex items-center justify-center border-4 border-primary/20 overflow-hidden shadow-2xl transition-transform group-hover:scale-105 duration-500">
                <img
                  alt="Student Avatar"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuVbvudLkYtQ0LhFkSYDCGJPlJv85Q1fV01cAvxuDXSdUB51TGpRKFJ4j6oG3QlYL9erVta6ThkfGFotyy4Omj0argyks_DdSRmre98-I3-8PgwXKmU0mocUSp9CP5TRv7dfoqd0ZQi68AYZSAO3pFzC4VofUwXR_wLLdo6M6UV0NTbIbBvPszsohi1cJj0Yh4thuPMqOIznJ3BxBlLRDIMSoa9C8yKritTpejFMgeAt_1hzrRbi4AHvWfpW34i5kx5Wc8esSzgZo"
                />
              </div>
              <button className="absolute -bottom-3 -right-3 bg-primary text-white p-3 rounded-2xl border-4 border-white dark:border-slate-900 shadow-xl hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-lg">edit_square</span>
              </button>
            </div>
            <div className="flex-grow text-center md:text-left space-y-3 pt-2">
              <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{user.name || "Student"}</h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <span className="inline-flex items-center px-5 py-2 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined text-sm mr-2 font-bold">school</span> Student Account
                </span>
                <span className="text-slate-500 dark:text-slate-400 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-primary">apartment</span>
                  Global Institute of Technology
                </span>
              </div>
              <p className="text-xl text-slate-500 dark:text-slate-400 font-bold tracking-tight">{user.email || "No email provided"}</p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 dark:border-slate-800 pb-5">
              <span className="material-symbols-outlined text-primary font-bold">id_card</span>
              <h3 className="text-xl font-black uppercase tracking-[0.15em] text-slate-800 dark:text-slate-200">Identity Details</h3>
            </div>
            <form className="space-y-6">
              {[
                { label: "Designated Full Name", id: "full-name", type: "text", value: user.name || "", icon: "person" },
                { label: "Authentication Email", id: "email", type: "email", value: user.email || "", icon: "alternate_email" },
                { label: "Campus Institution", id: "institution", type: "text", value: user.institution || "Global Institute of Technology", icon: "apartment" }
              ].map((field) => (
                <div key={field.id} className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1" htmlFor={field.id}>{field.label}</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors text-lg">{field.icon}</span>
                    <input
                      disabled
                      className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-12 py-4 focus:border-primary focus:ring-0 transition-all text-sm font-black text-slate-700 dark:text-slate-200 cursor-not-allowed opacity-80"
                      id={field.id}
                      type={field.type}
                      value={field.value}
                      readOnly
                    />
                  </div>
                </div>
              ))}
              <div className="flex gap-4 pt-4">
                <button className="flex-1 bg-primary text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:bg-blue-800 transition-all active:scale-95" type="submit">Update Info</button>
                <button className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-500 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-200 dark:hover:bg-slate-700 transition-all" type="button">Request Change</button>
              </div>
            </form>
          </section>

          <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 dark:border-slate-800 pb-5">
              <span className="material-symbols-outlined text-primary font-bold">accessibility_new</span>
              <h3 className="text-xl font-black uppercase tracking-[0.15em] text-slate-800 dark:text-slate-200">UI Calibrations</h3>
            </div>
            <div className="space-y-4">
              {[
                { title: "High Contrast Mode", desc: "Sharpen visual boundaries", icon: "contrast", active: user.accessibilityPreferences?.highContrast },
                { title: "Typography Scaling", desc: "Increase global font size", icon: "format_size", active: user.accessibilityPreferences?.largeFont },
                { title: "Voice assist synthesis", desc: "Interactive audio feedback", icon: "mic_none", active: user.accessibilityPreferences?.voiceAssist },
                { title: "ARIA Pattern Sync", desc: "Enhanced screen reader mapping", icon: "screen_search_desktop", active: user.accessibilityPreferences?.screenReaderOptimized }
              ].map((pref, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border-2 border-transparent hover:border-primary/20 transition-all group/item">
                  <div className="flex items-center gap-5">
                    <div className={`size-12 rounded-xl flex items-center justify-center transition-all ${pref.active ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-700"}`}>
                      <span className="material-symbols-outlined text-xl">{pref.icon}</span>
                    </div>
                    <div>
                      <p className="font-black text-sm text-slate-800 dark:text-slate-200 uppercase tracking-tight">{pref.title}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{pref.desc}</p>
                    </div>
                  </div>
                  <button className={`w-14 h-8 rounded-full relative transition-all focus:ring-4 ring-primary ring-offset-2 ${pref.active ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"}`}>
                    <span className={`absolute top-1 size-6 bg-white rounded-full shadow-sm transition-all ${pref.active ? "right-1" : "left-1"}`}></span>
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 dark:border-slate-800 pb-5">
              <span className="material-symbols-outlined text-primary font-bold">vpn_key</span>
              <h3 className="text-xl font-black uppercase tracking-[0.15em] text-slate-800 dark:text-slate-200">Security Access</h3>
            </div>
            <form className="space-y-5">
              {[
                { label: "Current Password", id: "current-password" },
                { label: "New Credentials", id: "new-password" },
                { label: "Confirm Credentials", id: "confirm-password" }
              ].map((f) => (
                <div key={f.id} className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1" htmlFor={f.id}>{f.label}</label>
                  <input className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 focus:border-primary focus:ring-0 transition-all font-bold text-sm" id={f.id} type="password" />
                </div>
              ))}
              <button className="w-full mt-4 bg-slate-900 dark:bg-primary text-white px-6 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-800 dark:hover:bg-blue-800 transition-all shadow-xl shadow-slate-900/10" type="submit">Update Password Protocol</button>
            </form>
          </section>

          <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 dark:border-slate-800 pb-5">
              <span className="material-symbols-outlined text-primary font-bold">history_edu</span>
              <h3 className="text-xl font-black uppercase tracking-[0.15em] text-slate-800 dark:text-slate-200">Exam Chronicle</h3>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-separate border-spacing-y-4">
                <thead>
                  <tr className="text-slate-400 uppercase text-[10px] font-black tracking-[0.2em]">
                    <th className="px-4 pb-2">Identification</th>
                    <th className="px-4 pb-2 text-center">Timeline</th>
                    <th className="px-4 pb-2 text-center">Score</th>
                    <th className="px-4 pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="space-y-4">
                  {results.length > 0 ? results.map((row, idx) => (
                    <tr key={idx} className="bg-slate-50/50 dark:bg-slate-800/30 group hover:bg-primary/5 transition-colors">
                      <td className="px-4 py-5 font-black text-sm rounded-l-2xl border-y border-l border-slate-100 dark:border-slate-800">{row.examId?.title || "Unknown Exam"}</td>
                      <td className="px-4 py-5 text-center text-[10px] font-black uppercase text-slate-500 border-y border-slate-100 dark:border-slate-800">
                        {new Date(row.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                      </td>
                      <td className="px-4 py-5 text-center border-y border-slate-100 dark:border-slate-800">
                        <span className={`text-sm font-black ${row.score >= 5 ? "text-green-500" : "text-primary"}`}>{row.score}</span>
                      </td>
                      <td className="px-4 py-5 text-right rounded-r-2xl border-y border-r border-slate-100 dark:border-slate-800">
                        <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Transcript</button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="text-center py-10 text-slate-400 font-bold uppercase text-xs tracking-widest">
                        No examination records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <button
              className="w-full mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-primary font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:gap-4 transition-all"
              onClick={() => navigate("/result")}
            >
              Access Global History <span className="material-symbols-outlined text-sm">arrow_right_alt</span>
            </button>
          </section>
        </div>

        <section className="mt-12 group">
          <button
            onClick={handleLogout}
            className="w-full bg-white dark:bg-slate-900 border-2 border-red-500/20 hover:border-red-500 py-6 rounded-[2.5rem] flex items-center justify-center gap-4 transition-all hover:bg-red-50 dark:hover:bg-red-950/20 shadow-xl shadow-slate-200/50 dark:shadow-none animate-in fade-in slide-in-from-bottom duration-700 delay-300"
          >
            <div className="size-12 bg-red-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl font-bold">logout</span>
            </div>
            <div className="text-left">
              <p className="text-xl font-black text-red-600 dark:text-red-400 uppercase tracking-tighter">Securely Terminate Session</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">All active authentication protocols will be cleared</p>
            </div>
          </button>
        </section>
      </main>

      <footer className="mt-20 border-t border-slate-100 dark:border-slate-800 bg-white/30 dark:bg-slate-950/30 backdrop-blur-md py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
          <div className="flex items-center gap-3 text-primary opacity-60 grayscale hover:grayscale-0 transition-all">
            <span className="material-symbols-outlined font-black">visibility</span>
            <span className="text-xl font-black tracking-tighter">ExamAble Protocol</span>
          </div>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.1em]">© 2026 Accessibility Exam Initiative. Advanced Integrity Systems.</p>
          <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            <a className="hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-1" href="#">Security Core</a>
            <a className="hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-1" href="#">Data Ethics</a>
            <a className="hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-1" href="#">Support Mesh</a>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { height: 4px; width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; }
      `}} />
    </div>
  );
};

export default Profile;


