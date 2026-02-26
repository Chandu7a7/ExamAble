import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (token) {
      setIsLoggedIn(true);
      setUserRole(user.role);
    }
  }, []);

  return (
    <div className="bg-background-light dark:bg-background-dark font-body text-slate-900 dark:text-slate-100 transition-colors duration-300 min-h-screen selection:bg-primary/30">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        {/* Background blobs for premium feel */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 -right-4 w-96 h-96 bg-primary/10 rounded-full blur-[150px] pointer-events-none" />

        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/70 dark:bg-background-dark/70 backdrop-blur-xl transition-all">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate("/")}>
              <div className="bg-gradient-to-br from-primary to-primary-dark p-2 rounded-xl text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined block text-2xl">visibility</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light dark:from-white dark:to-slate-400">
                ExamAble
              </h1>
            </div>

            <nav className="hidden lg:flex items-center gap-10" aria-label="Primary navigation">
              {["About", "Features", "Accessibility", "Contact"].map((item) => (
                <a
                  key={item}
                  className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-all hover:-translate-y-0.5"
                  href={`#${item.toLowerCase()}`}
                >
                  {item}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 mr-2">
                <button
                  aria-label="Toggle High Contrast"
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all active:scale-95"
                  type="button"
                >
                  <span className="material-symbols-outlined">contrast</span>
                </button>
                <button
                  aria-label="Accessibility Menu"
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all active:scale-95"
                  type="button"
                >
                  <span className="material-symbols-outlined">accessibility_new</span>
                </button>
              </div>
              {isLoggedIn ? (
                <button
                  className="px-8 py-2.5 text-sm font-black bg-primary text-white rounded-xl hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-95 shadow-lg shadow-primary/10 flex items-center gap-2"
                  type="button"
                  onClick={() => navigate(userRole === "admin" ? "/admin" : "/dashboard")}
                >
                  <span className="material-symbols-outlined text-lg">dashboard</span>
                  Dashboard
                </button>
              ) : (
                <>
                  <button
                    className="hidden md:block px-6 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-white transition-colors"
                    type="button"
                    onClick={() => navigate("/register")}
                  >
                    Register
                  </button>
                  <button
                    className="px-8 py-2.5 text-sm font-bold bg-primary text-white rounded-xl hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-95 shadow-lg shadow-primary/10"
                    type="button"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </button>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative mx-auto max-w-7xl px-6 pt-20 pb-24 md:pt-32 md:pb-40 overflow-hidden" id="about">
            <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
              <div className="flex flex-col gap-8 relative z-10 animate-in fade-in slide-in-from-left duration-1000">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 dark:bg-primary/10 border border-primary/10 px-4 py-2 text-sm font-bold text-primary dark:text-primary-light w-fit">
                  <span className="material-symbols-outlined text-base">verified_user</span>
                  Official WCAG 2.1 Compliant Platform
                </div>
                <h2 className="text-5xl font-black leading-[1.1] tracking-tight text-slate-900 dark:text-white md:text-7xl">
                  Empowering <span className="text-primary italic">Every</span> Learner.
                </h2>
                <p className="text-xl leading-relaxed text-slate-600 dark:text-slate-400 max-w-xl">
                  Advanced voice-enabled digital examination platform designed from the ground up for visually impaired students. Secure, accessible, and seamless.
                </p>
                <div className="flex flex-col sm:flex-row gap-5 pt-4">
                  <button
                    className="flex h-16 min-w-[200px] items-center justify-center rounded-2xl bg-gradient-to-r from-primary to-primary-dark px-8 text-lg font-black text-white shadow-2xl shadow-primary/40 hover:scale-[1.02] hover:shadow-primary/50 transition-all active:scale-95 group"
                    type="button"
                    onClick={() => navigate(isLoggedIn ? (userRole === "admin" ? "/admin" : "/dashboard") : "/login")}
                  >
                    {isLoggedIn ? "Go to Dashboard" : "Get Started Now"}
                    <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
                  <button
                    className="flex h-16 min-w-[200px] items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 px-8 text-lg font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all active:scale-95 shadow-sm"
                    type="button"
                  >
                    <span className="material-symbols-outlined mr-3 text-primary">headphones</span>
                    Live Demo
                  </button>
                </div>
              </div>

              <div className="relative group animate-in slide-in-from-bottom duration-1000 delay-200" aria-hidden="true">
                <div className="absolute -inset-10 rounded-[4rem] bg-gradient-to-tr from-primary/20 to-purple-500/10 blur-3xl opacity-50 group-hover:opacity-80 transition-opacity" />
                <div className="relative overflow-hidden rounded-[2.5rem] border border-white/20 bg-white dark:bg-slate-900 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.55)]">
                  <img
                    alt="Accessible UI Interface"
                    className="aspect-[4/3] w-full object-cover group-hover:scale-105 transition-transform duration-700"
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-bottom p-10">
                    <p className="text-white font-bold text-lg mt-auto">Built for NVDA, JAWS & VoiceOver</p>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 animate-bounce transition-all duration-[3000ms]">
                  <span className="material-symbols-outlined text-4xl text-primary animate-pulse">keyboard_voice</span>
                </div>
                <div className="absolute -bottom-8 -left-8 bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 animate-pulse transition-all duration-[5000ms]">
                  <div className="flex gap-2">
                    {[1, 2, 3].map(i => <div key={i} className="h-6 w-1 bg-primary rounded-full" />)}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Assistant Banner */}
          <section className="mx-auto max-w-7xl px-6 py-8" aria-label="Voice assistant status">
            <div className="group relative flex flex-col items-center justify-between gap-8 rounded-[2.5rem] bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-2 border-primary/20 p-8 md:flex-row shadow-inner overflow-hidden">
              <div className="absolute inset-0 bg-primary/2 dark:bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex gap-6 relative z-10 text-center md:text-left flex-col md:flex-row items-center">
                <div className="flex h-20 w-20 flex-none items-center justify-center rounded-full bg-primary text-white shadow-xl shadow-primary/30 animate-pulse-slow">
                  <span className="material-symbols-outlined text-3xl">mic</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-2xl font-black text-primary dark:text-white">
                    Dynamic Voice Assistant Active
                  </p>
                  <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
                    "Hello! How can I help you navigate the portal today? Say &apos;Start&apos; to begin."
                  </p>
                </div>
              </div>
              <button
                className="relative z-10 rounded-2xl bg-white dark:bg-slate-800 px-8 h-14 text-sm font-black text-primary dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-sm transition-all active:scale-95"
                type="button"
              >
                Customize Voice
              </button>
            </div>
          </section>

          {/* Features */}
          <section className="relative py-32 bg-slate-50 dark:bg-slate-900/40" id="features">
            <div className="mx-auto max-w-7xl px-6">
              <div className="mb-20 text-center max-w-3xl mx-auto">
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-primary mb-4">Core Infrastructure</h2>
                <h3 className="text-4xl font-black text-slate-900 dark:text-white md:text-5xl lg:text-6xl">
                  Inclusive Engineering.
                </h3>
                <p className="mt-6 text-xl text-slate-600 dark:text-slate-400">
                  Every interaction is optimized for non-visual navigation without compromising on speed or security.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { icon: "keyboard_voice", title: "Voice Control", desc: "Navigate every page with natural language commands." },
                  { icon: "keyboard", title: "Key-Centric", desc: "Logical tab orders and 150+ custom keyboard shortcuts." },
                  { icon: "record_voice_over", title: "Advanced TTS", desc: "Crystal clear ARIA descriptions for complex data tables." },
                  { icon: "security", title: "Secure Proctor", desc: "AI-driven monitoring ensures total exam integrity." },
                  { icon: "monitoring", title: "Admin Portal", desc: "Real-time insights for institutions and educators." },
                  { icon: "language", title: "Multi-Lingual", desc: "Support for 40+ languages and regional dialects." },
                ].map((feature, idx) => (
                  <div key={idx} className="group flex flex-col gap-6 rounded-3xl border border-white dark:border-slate-800 bg-white dark:bg-slate-900/50 p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors shadow-inner">
                      <span className="material-symbols-outlined text-3xl">{feature.icon}</span>
                    </div>
                    <div>
                      <h4 className="text-2xl font-black dark:text-white mb-3">{feature.title}</h4>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Accessibility Commitment */}
          <section className="mx-auto max-w-7xl px-6 py-32" id="accessibility">
            <div className="grid grid-cols-1 gap-20 lg:grid-cols-2 items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
                <div className="relative grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-700 hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-4xl text-green-500 mb-4">check_circle</span>
                      <h5 className="font-black dark:text-white">WCAG AAA</h5>
                    </div>
                    <div className="bg-primary text-white p-8 rounded-[2rem] shadow-xl hover:scale-105 transition-transform translate-x-4">
                      <span className="material-symbols-outlined text-4xl mb-4">bolt</span>
                      <h5 className="font-black">Zero Latency</h5>
                    </div>
                  </div>
                  <div className="space-y-4 pt-12">
                    <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-4xl text-primary mb-4">settings_accessibility</span>
                      <h5 className="font-black text-xl leading-snug">Personalized Contrast</h5>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-700 hover:scale-105 transition-transform -translate-x-4">
                      <span className="material-symbols-outlined text-4xl text-blue-500 mb-4">visibility_off</span>
                      <h5 className="font-black dark:text-white">Braille Ready</h5>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-primary mb-4 underline decoration-4 underline-offset-8">Our Mission</h2>
                <h3 className="text-4xl font-black text-slate-900 dark:text-white md:text-5xl mb-8 leading-tight">
                  Breaking Barriers <br />Through Innovation.
                </h3>
                <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed font-medium">
                  We believe that education is a right, not a privilege. Our platform is continuously audited by accessibility experts and blind students to ensure that every pixel, every sound, and every keystroke serves the goal of true inclusion.
                </p>
                <div className="space-y-5">
                  {["100% ARIA Coverage for all elements.", "Optimized for NVDA, JAWS & VoiceOver.", "Dynamic text scaling without layout breakage."].map((text, idx) => (
                    <div key={idx} className="flex items-center gap-4 group">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-sm">done</span>
                      </div>
                      <span className="text-lg font-bold text-slate-700 dark:text-slate-200">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="mx-auto max-w-7xl px-6 py-20" id="contact">
            <div className="relative rounded-[3.5rem] bg-slate-900 px-10 py-24 text-center text-white shadow-2xl shadow-primary/20 overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none" aria-hidden="true">
                <span className="material-symbols-outlined text-[15rem]">graphic_eq</span>
              </div>
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary rounded-full blur-[150px] opacity-30 pointer-events-none" />

              <h2 className="relative z-10 text-4xl font-black md:text-6xl mb-8">
                Ready to Join the Revolution?
              </h2>
              <p className="relative z-10 mx-auto max-w-2xl text-xl text-slate-400 mb-12 font-medium">
                Standardize accessibility across your whole institution with a single platform.
              </p>
              <div className="relative z-10 flex flex-col sm:flex-row justify-center gap-6">
                <button
                  className="h-18 rounded-2xl bg-primary px-12 text-xl font-black text-white hover:bg-primary-dark shadow-xl shadow-primary/40 active:scale-95 transition-all"
                  type="button"
                  onClick={() => navigate(isLoggedIn ? (userRole === "admin" ? "/admin" : "/dashboard") : "/login")}
                >
                  Start Now — It&apos;s Free
                </button>
                <button
                  className="h-18 rounded-2xl border-2 border-white/20 bg-white/5 backdrop-blur-md px-12 text-xl font-bold text-white hover:bg-white/10 active:scale-95 transition-all"
                  type="button"
                >
                  Contact Sales
                </button>
              </div>
            </div>
          </section>
        </main>

        <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark py-20 selection:text-white selection:bg-primary">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 gap-16 md:grid-cols-4">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="bg-primary p-2 rounded-xl text-white">
                    <span className="material-symbols-outlined block">visibility</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">ExamAble</h3>
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  Leading the way in digital assessment accessibility. Removing barriers for students worldwide.
                </p>
              </div>
              <div>
                <h4 className="mb-8 font-black uppercase tracking-widest text-primary text-sm">Product</h4>
                <ul className="space-y-5 text-slate-600 dark:text-slate-400 font-bold">
                  {["Overview", "Features", "Solutions", "Pricing"].map((item) => (
                    <li key={item}><a className="hover:text-primary transition-colors hover:translate-x-1 inline-block" href="#">{item}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="mb-8 font-black uppercase tracking-widest text-primary text-sm">Legal</h4>
                <ul className="space-y-5 text-slate-600 dark:text-slate-400 font-bold">
                  {["Accessibility", "Privacy", "Terms", "Support"].map((item) => (
                    <li key={item}><a className="hover:text-primary transition-colors hover:translate-x-1 inline-block" href="#">{item}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="mb-8 font-black uppercase tracking-widest text-primary text-sm">Connect</h4>
                <div className="flex gap-4">
                  {["mail", "call", "public"].map((icon, idx) => (
                    <a
                      key={idx}
                      className="h-12 w-12 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-90"
                      href="#"
                    >
                      <span className="material-symbols-outlined">{icon}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-20 pt-10 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-slate-500 font-bold">© 2026 ExamAble Portal. Built for Everyone.</p>
              <div className="flex gap-8 text-sm font-black text-primary">
                <button className="hover:underline">English (US)</button>
                <button className="hover:underline">Accessibility Settings</button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
