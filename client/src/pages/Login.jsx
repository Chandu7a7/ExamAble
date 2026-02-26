import API_BASE from "../api.js";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to log in");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-body text-slate-900 dark:text-slate-100 h-screen flex flex-col selection:bg-primary/30 overflow-hidden relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <header className="w-full shrink-0 border-b border-white/10 bg-white/70 dark:bg-background-dark/70 backdrop-blur-xl px-6 md:px-10 py-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 group cursor-pointer" onClick={() => navigate("/")}>
            <div className="bg-gradient-to-br from-primary to-primary-dark p-1.5 rounded-lg text-white shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined block text-lg">visibility</span>
            </div>
            <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
              ExamAble
            </h1>
          </div>
          <nav aria-label="Accessibility Controls" className="flex items-center gap-2">
            <button
              aria-label="Screen Reader Mode"
              className="flex items-center justify-center p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-xl">record_voice_over</span>
            </button>
            <button
              aria-label="Toggle High Contrast"
              className="flex items-center justify-center p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-xl">contrast</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-2 md:p-4 relative z-10 overflow-hidden">
        <div className="w-full max-w-5xl h-full grid grid-cols-1 lg:grid-cols-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[2rem] shadow-2xl overflow-hidden border border-white/20">

          <div className="hidden lg:flex flex-col justify-center p-10 bg-gradient-to-br from-primary to-primary-dark text-white relative overflow-hidden">
            <div className="relative z-10 animate-in fade-in slide-in-from-left duration-700">
              <div className="mb-4 inline-flex items-center justify-center h-10 w-10 rounded-xl bg-white/20 backdrop-blur-lg border border-white/30">
                <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
              </div>
              <h2 className="text-3xl font-black mb-3 leading-tight tracking-tight">
                Secure Portal Access
              </h2>
              <p className="text-sm text-blue-100 mb-6 font-medium leading-relaxed opacity-90">
                Welcome back to your accessible academic journey. Your safety and integrity are our top priority.
              </p>
              <div className="space-y-3">
                {[
                  { icon: "verified_user", text: "Identity Verification" },
                  { icon: "security", text: "Proctored Environment" },
                  { icon: "accessibility_new", text: "WCAG 2.1 AAA Standard" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 group">
                    <div className="h-8 w-8 flex items-center justify-center bg-white/10 rounded-lg border border-white/20 group-hover:bg-white group-hover:text-primary transition-all">
                      <span className="material-symbols-outlined text-lg">{item.icon}</span>
                    </div>
                    <span className="font-bold text-sm tracking-wide">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center overflow-hidden">
            <div className="p-6 md:p-10">
              <div className="mb-6">
                <div
                  aria-live="polite"
                  className={`flex items-center gap-2.5 mb-5 ${error ? "bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 border-red-200" : "bg-primary/5 dark:bg-primary/10 text-primary dark:text-primary-light border-primary/20"} px-3 py-2.5 rounded-xl border transition-all`}
                  role="alert"
                >
                  <span className="material-symbols-outlined text-xl font-bold">{error ? "error" : "volume_up"}</span>
                  <p className="font-bold text-sm">
                    {error || "Please enter your credentials."}
                  </p>
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1.5 underline decoration-primary/30 underline-offset-8">Welcome Back</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  Log in to your student account.
                </p>
              </div>

              <form
                className="space-y-4"
                onSubmit={handleSubmit}
              >
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                      <span className="material-symbols-outlined text-lg">mail</span>
                    </div>
                    <input
                      aria-required="true"
                      className="block w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm font-bold transition-all focus:border-primary focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-primary/5 outline-none disabled:opacity-50"
                      id="email"
                      name="email"
                      placeholder="name@university.edu"
                      required
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400" htmlFor="password">
                      Security Password
                    </label>
                    <a className="text-primary font-black hover:underline underline-offset-4 decoration-2 text-[10px]" href="#">
                      Forgot?
                    </a>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                      <span className="material-symbols-outlined text-lg">lock</span>
                    </div>
                    <input
                      aria-required="true"
                      className="block w-full pl-11 pr-11 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm font-bold transition-all focus:border-primary focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-primary/5 outline-none disabled:opacity-50"
                      id="password"
                      name="password"
                      placeholder="••••••••••••"
                      required
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <button
                      aria-label="Show password"
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-primary transition-colors"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-lg">visibility</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    className="h-4 w-4 rounded border-slate-200 dark:border-slate-700 text-primary focus:ring-primary transition-all cursor-pointer"
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                  />
                  <label className="ml-2.5 block text-sm font-bold text-slate-600 dark:text-slate-400 cursor-pointer" htmlFor="remember-me">
                    Remember device
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    className="w-full bg-primary hover:bg-primary-dark text-white font-black text-base py-3.5 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2.5 disabled:opacity-70 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={loading}
                  >
                    <span>{loading ? "AUTHENTICATING..." : "LOG IN TO PORTAL"}</span>
                    <span className={`material-symbols-outlined text-lg transition-transform ${loading ? "animate-spin" : ""}`}>
                      {loading ? "progress_activity" : "arrow_forward"}
                    </span>
                  </button>
                </div>
              </form>

              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center lg:text-left">
                <p className="text-sm text-slate-500 dark:text-slate-400 font-bold">
                  New student?
                  <Link className="text-primary font-black hover:underline underline-offset-4 decoration-2 ml-2" to="/register">
                    Request Credentials
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full shrink-0 py-3 px-8 border-t border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 text-slate-400 font-bold text-[9px] uppercase tracking-[0.1em]">
          <p>© 2024 ExamAble Protocol. All Rights Reserved.</p>
          <div className="flex gap-5">
            <a className="hover:text-primary transition-colors" href="#">Accessibility</a>
            <a className="hover:text-primary transition-colors" href="#">Privacy</a>
            <a className="hover:text-primary transition-colors" href="#">Help System</a>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
      `}} />
    </div>
  );
};

export default Login;


