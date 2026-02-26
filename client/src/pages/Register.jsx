import API_BASE from "../../api.js";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    institution: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id === "full-name" ? "name" : e.target.id]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 h-screen overflow-hidden relative">
      <div className="flex h-full flex-col">
        <header className="shrink-0 flex items-center justify-between whitespace-nowrap border-b border-slate-200 dark:border-slate-800 px-6 md:px-10 py-3 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3 text-primary">
            <div className="bg-primary/10 p-1.5 rounded-lg">
              <span className="material-symbols-outlined text-xl">school</span>
            </div>
            <h1 className="text-slate-900 dark:text-slate-100 text-lg font-bold tracking-tight">
              ExamAble
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link className="text-slate-700 dark:text-slate-300 text-xs font-semibold hover:text-primary transition-colors" to="/login">
              Login
            </Link>
            <button className="flex items-center justify-center rounded-lg h-8 px-3 bg-primary text-white text-xs font-bold shadow-sm hover:bg-primary/90 transition-all" type="button">
              <span className="material-symbols-outlined mr-1.5 text-sm">help</span>
              Help
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar px-4 py-6 md:py-8 lg:px-8">
          <div className="max-w-[1000px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">

            <div className="lg:col-span-12">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 md:p-8">
                <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white underline decoration-primary/30 underline-offset-8">Create Account</h2>
                    <p className="text-sm text-slate-500 mt-2 font-medium">Join the accessible examination portal.</p>
                  </div>
                  <div className="bg-primary/5 dark:bg-primary/10 border-l-2 border-primary px-4 py-2 rounded-r-lg max-w-sm">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-lg">{error ? "error" : "volume_up"}</span>
                      <p className="text-slate-700 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider">{error || "Voice Guide Active"}</p>
                    </div>
                  </div>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black uppercase text-slate-400 tracking-widest" htmlFor="full-name">Full Name</label>
                      <input className="w-full h-11 rounded-lg border border-slate-300 dark:border-slate-700 bg-background-light dark:bg-slate-800 px-4 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary outline-none" id="full-name" placeholder="John Doe" type="text" value={formData.name} onChange={handleChange} required disabled={loading} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black uppercase text-slate-400 tracking-widest" htmlFor="email">Email Address</label>
                      <input className="w-full h-11 rounded-lg border border-slate-300 dark:border-slate-700 bg-background-light dark:bg-slate-800 px-4 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary outline-none" id="email" placeholder="name@edu.io" type="email" value={formData.email} onChange={handleChange} required disabled={loading} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black uppercase text-slate-400 tracking-widest" htmlFor="password">Password</label>
                      <input className="w-full h-11 rounded-lg border border-slate-300 dark:border-slate-700 bg-background-light dark:bg-slate-800 px-4 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary outline-none" id="password" placeholder="••••••••" type="password" value={formData.password} onChange={handleChange} required disabled={loading} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black uppercase text-slate-400 tracking-widest" htmlFor="confirmPassword">Confirm</label>
                      <input className="w-full h-11 rounded-lg border border-slate-300 dark:border-slate-700 bg-background-light dark:bg-slate-800 px-4 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary outline-none" id="confirmPassword" placeholder="••••••••" type="password" value={formData.confirmPassword} onChange={handleChange} required disabled={loading} />
                    </div>
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="block text-xs font-black uppercase text-slate-400 tracking-widest" htmlFor="institution">Institution</label>
                      <input className="w-full h-11 rounded-lg border border-slate-300 dark:border-slate-700 bg-background-light dark:bg-slate-800 px-4 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary outline-none" id="institution" placeholder="University Name" type="text" value={formData.institution} onChange={handleChange} disabled={loading} />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-primary mb-4">Accessibility Preference Protocol</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {[
                        { id: "high-contrast", l: "Contrast", i: "contrast" },
                        { id: "large-font", l: "Scaling", i: "format_size" },
                        { id: "voice-assist", l: "Audio", i: "volume_up" },
                        { id: "screen-reader", l: "ARIA", i: "settings_accessibility" }
                      ].map((pref) => (
                        <div key={pref.id} className="flex flex-col gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-primary/30 transition-colors">
                          <div className="flex items-center justify-between">
                            <span className="material-symbols-outlined text-primary text-xl">{pref.i}</span>
                            <div className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 bg-slate-300 dark:bg-slate-600">
                              <input className="sr-only peer" id={pref.id} type="checkbox" />
                              <span className="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition translate-x-0 peer-checked:translate-x-4 peer-checked:bg-primary" />
                            </div>
                          </div>
                          <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest" htmlFor={pref.id}>{pref.l} MODE</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 flex flex-col items-center gap-4">
                    <button className="w-full h-14 bg-primary text-white text-lg font-black rounded-xl shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed" type="submit" disabled={loading}>
                      {loading ? "CREATING ACCOUNT..." : "ACTIVATE ACCOUNT"}
                    </button>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-bold">
                      Already registered? <Link className="text-primary hover:underline underline-offset-4 decoration-2" to="/login">Log in here</Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>

            <div className="lg:col-span-12 text-center pb-8">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">
                Designed for absolute inclusivity. Need help? Press <kbd className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300">ALT + H</kbd> for live protocol support.
              </p>
            </div>
          </div>
        </main>
      </div>

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

export default Register;

