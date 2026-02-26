import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar.jsx";

const CreateExam = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [bankQuestions, setBankQuestions] = useState([]);
  const [selectorLoading, setSelectorLoading] = useState(false);
  const [selectorSearch, setSelectorSearch] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: 60,
    totalMarks: 100,
    startTime: "",
    endTime: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBankQuestions();
  }, []);

  const fetchBankQuestions = async () => {
    try {
      setSelectorLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/questions", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setBankQuestions(data);
      }
    } catch (error) {
      console.error("Error fetching bank questions:", error);
    } finally {
      setSelectorLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...formData,
        questions: questions.map(q => ({
          type: q.type,
          text: q.text,
          options: q.type === "MCQ" ? q.options : [],
          correctOption: q.type === "MCQ" ? q.answer : undefined,
          keywords: q.type === "Short Answer" ? q.keywords : undefined,
          marks: 1, // Default marks
          image: q.image, // NEW: Include image from bank or manual
          accessibilityText: q.accessibilityText // NEW: Include alt text
        }))
      };

      const response = await fetch("http://localhost:5000/api/exams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        alert("Assessment Deployed Successfully!");
        navigate("/admin");
      } else {
        alert("Error: " + (data.message || "Failed to deploy assessment"));
      }
    } catch (error) {
      console.error("Submit Error:", error);
      alert("Network Error: Could not reach server");
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = (type) => {
    if (type === "MCQ") {
      setIsSelectorOpen(true);
      return;
    }
    const newId = Date.now();
    setQuestions([...questions, { id: newId, type: "Short Answer", text: "", keywords: "" }]);
  };

  const handleAddFromBank = (qBank) => {
    const newId = Date.now() + Math.random();
    setQuestions([...questions, {
      id: newId,
      type: "MCQ",
      text: qBank.text,
      options: qBank.options,
      answer: qBank.correctOption,
      image: qBank.image, // NEW
      accessibilityText: qBank.accessibilityText, // NEW
      fromBank: true,
      bankId: qBank._id
    }]);
    setIsSelectorOpen(false);
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex selection:bg-primary/30">
      {/* Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl sticky top-0 z-30 px-10 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <span className="material-symbols-outlined text-2xl font-black">edit_document</span>
            </div>
            <h2 className="text-xl font-black tracking-tight uppercase italic">Architect New Examination</h2>
          </div>
          <div className="flex items-center gap-6">
            <button aria-label="Notifications" className="p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all active:scale-90 relative">
              <span className="material-symbols-outlined text-2xl">notifications</span>
              <span className="absolute top-3 right-3 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
            </button>
            <button className="bg-primary text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all">
              <span className="material-symbols-outlined text-lg">save</span>
              Auto-Sync Active
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="p-12 max-w-5xl mx-auto w-full space-y-16 animate-in fade-in slide-in-from-bottom duration-700">
          {/* Voice Assistant Banner */}
          <div aria-live="polite" className="p-8 rounded-[2.5rem] bg-gradient-to-r from-primary to-primary-dark text-white flex items-center gap-6 shadow-2xl shadow-primary/30 border border-white/10" role="alert">
            <div className="size-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner hover:rotate-6 transition-transform">
              <span className="material-symbols-outlined text-3xl animate-pulse">record_voice_over</span>
            </div>
            <div>
              <p className="font-black text-2xl tracking-tight leading-none mb-2 italic underline decoration-white/30 decoration-2 underline-offset-4">Infrastructural Guidance</p>
              <p className="text-white/70 font-bold uppercase tracking-[0.1em] text-xs">Awaiting calibration data for new assessment batch. All fields require input.</p>
            </div>
          </div>

          <form className="space-y-16" onSubmit={handleSubmit}>
            {/* Section: Basic Information */}
            <section className="bg-white dark:bg-slate-900/50 backdrop-blur-md rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
              <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-2xl font-black tracking-tight flex items-center gap-4 italic uppercase">
                  <div className="size-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined">info</span>
                  </div>
                  Basic Calibration
                </h3>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Protocol Alpha-1</span>
              </div>

              <div className="p-12 grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="md:col-span-2 space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2" htmlFor="exam-title">Assessment Identity <span aria-hidden="true" className="text-red-500 font-black">*</span></label>
                  <input
                    className="w-full bg-slate-50/50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-6 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-black text-xl italic tracking-tight outline-none"
                    id="exam-title"
                    name="title"
                    placeholder="Ex: ADVANCED MATHEMATICAL MODELS"
                    required
                    type="text"
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="md:col-span-2 space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2" htmlFor="exam-desc">Operational Directives</label>
                  <textarea
                    className="w-full bg-slate-50/50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-6 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-lg outline-none resize-none"
                    id="exam-desc"
                    name="description"
                    placeholder="Enforce strict isolation protocols and accessibility guidance..."
                    rows="4"
                    value={formData.description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2" htmlFor="duration">Temporal Window (MINUTES) <span aria-hidden="true" className="text-red-500 font-black">*</span></label>
                  <div className="relative group">
                    <input
                      className="w-full bg-slate-50/50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-6 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all pl-16 font-black text-xl outline-none"
                      id="duration"
                      name="duration"
                      placeholder="60"
                      required
                      type="number"
                      value={formData.duration}
                      onChange={handleInputChange}
                    />
                    <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">timer</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2" htmlFor="total-marks">Assessment Value (POINTS) <span aria-hidden="true" className="text-red-500 font-black">*</span></label>
                  <div className="relative group">
                    <input
                      className="w-full bg-slate-50/50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-6 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all pl-16 font-black text-xl outline-none"
                      id="total-marks"
                      name="totalMarks"
                      placeholder="100"
                      required
                      type="number"
                      value={formData.totalMarks}
                      onChange={handleInputChange}
                    />
                    <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">grade</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Section: Schedule */}
            <section className="bg-white dark:bg-slate-900/50 backdrop-blur-md rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
              <div className="p-10 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-2xl font-black tracking-tight flex items-center gap-4 italic uppercase">
                  <div className="size-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined">calendar_month</span>
                  </div>
                  Scheduling Matrix
                </h3>
              </div>
              <div className="p-12 grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2" htmlFor="start-time">Deployment Initiation <span aria-hidden="true" className="text-red-500 font-black">*</span></label>
                  <input
                    className="w-full bg-slate-50/50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-6 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-black text-sm uppercase tracking-widest outline-none"
                    id="start-time"
                    name="startTime"
                    required
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2" htmlFor="end-time">Deployment Expiration <span aria-hidden="true" className="text-red-500 font-black">*</span></label>
                  <input
                    className="w-full bg-slate-50/50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-6 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-black text-sm uppercase tracking-widest outline-none"
                    id="end-time"
                    name="endTime"
                    required
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </section>

            {/* Section: Accessibility Options */}
            <section className="bg-white dark:bg-slate-900/50 backdrop-blur-md rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
              <div className="p-10 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-2xl font-black tracking-tight flex items-center gap-4 italic uppercase">
                  <div className="size-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined">accessibility_new</span>
                  </div>
                  Inclusion Protocols
                </h3>
              </div>
              <div className="p-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { label: "Vocalized Guidance", sub: "Force audio navigation", checked: true },
                  { label: "Dynamic Narration", sub: "Auto-read on focus", checked: true },
                  { label: "Shield Legacy Mode", sub: "NVDA/JAWS optimization", checked: true }
                ].map((opt, i) => (
                  <label key={i} className="group flex items-center justify-between p-8 bg-slate-50/50 dark:bg-slate-800/50 rounded-3xl cursor-pointer hover:bg-primary/5 transition-all border-2 border-transparent hover:border-primary/20">
                    <div className="flex flex-col gap-1">
                      <span className="font-black text-sm uppercase tracking-tighter text-slate-900 dark:text-white">{opt.label}</span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{opt.sub}</span>
                    </div>
                    <div className="relative">
                      <input checked={opt.checked} readOnly className="peer sr-only" type="checkbox" />
                      <div className="w-12 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer-checked:bg-primary transition-colors shadow-inner" />
                      <div className="absolute top-1 left-1 size-4 bg-white rounded-full transition-transform peer-checked:translate-x-6 shadow-md" />
                    </div>
                  </label>
                ))}
              </div>
            </section>

            {/* Section: Question Builder */}
            <section className="bg-white dark:bg-slate-900/50 backdrop-blur-md rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
              <div className="p-10 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex justify-between items-center">
                <h3 className="text-2xl font-black tracking-tight flex items-center gap-4 italic uppercase">
                  <div className="size-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined">quiz</span>
                  </div>
                  Sequence Architect
                </h3>
                <div className="flex gap-4">
                  <button onClick={() => addQuestion("MCQ")} className="px-6 py-3 bg-primary/10 text-primary border border-primary/20 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-primary/20 transition-all active:scale-95" type="button">
                    <span className="material-symbols-outlined text-lg">add_circle</span> Add MCQ
                  </button>
                  <button onClick={() => addQuestion("Short")} className="px-6 py-3 bg-primary/10 text-primary border border-primary/20 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-primary/20 transition-all active:scale-95" type="button">
                    <span className="material-symbols-outlined text-lg">add_box</span> Add Text
                  </button>
                </div>
              </div>

              <div className="p-12 space-y-10">
                {questions.map((q, idx) => (
                  <div key={idx} className="p-10 bg-slate-50/50 dark:bg-slate-800/50 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800 relative group/card hover:border-primary/30 transition-all">
                    <button
                      onClick={() => removeQuestion(q.id)}
                      aria-label="Remove Question"
                      className="absolute right-8 top-8 size-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all opacity-0 group-hover/card:opacity-100"
                      type="button"
                    >
                      <span className="material-symbols-outlined">delete_forever</span>
                    </button>

                    <div className="flex gap-6 mb-8 items-center">
                      <div className="size-12 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-black text-lg italic shadow-lg">
                        {idx + 1}
                      </div>
                      <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20">
                        {q.type === "MCQ" ? "Divergent Choice" : "Synthetic Text"}
                      </span>
                      {q.fromBank && (
                        <span className="bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-500/20 italic">
                          Imported from Repository
                        </span>
                      )}
                    </div>

                    <div className="space-y-8">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Question Core Content</label>
                        <input className="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-6 focus:border-primary transition-all font-black text-lg tracking-tight italic" type="text" value={q.text} onChange={(e) => {
                          const newQs = [...questions];
                          newQs[idx].text = e.target.value;
                          setQuestions(newQs);
                        }} placeholder="TYPE SYSTEM PROMPT..." />
                      </div>

                      {q.type === "MCQ" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {q.options.map((opt, optIdx) => (
                            <div key={optIdx} className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 group/opt hover:border-primary/20 transition-all">
                              <input checked={q.answer === optIdx} onChange={() => {
                                const newQs = [...questions];
                                newQs[idx].answer = optIdx;
                                setQuestions(newQs);
                              }} className="size-6 text-primary focus:ring-primary bg-slate-100 dark:bg-slate-800 border-none transition-all cursor-pointer" type="radio" />
                              <input className="flex-1 bg-transparent border-none focus:ring-0 p-2 font-bold text-slate-600 dark:text-slate-300" placeholder={`OPTION ${optIdx + 1}`} type="text" value={opt} onChange={(e) => {
                                const newQs = [...questions];
                                newQs[idx].options[optIdx] = e.target.value;
                                setQuestions(newQs);
                              }} />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Verification Keywords</label>
                          <input className="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-5 focus:border-primary border-dashed transition-all font-bold text-slate-500" placeholder="ENTER DESCRIPTOR KEYWORDS..." type="text" value={q.keywords} onChange={(e) => {
                            const newQs = [...questions];
                            newQs[idx].keywords = e.target.value;
                            setQuestions(newQs);
                          }} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Empty State Question Add */}
                <button
                  onClick={() => addQuestion("MCQ")}
                  className="w-full py-16 border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[3rem] flex flex-col items-center justify-center text-slate-300 hover:border-primary/30 hover:text-primary transition-all group active:scale-[0.98]"
                  type="button"
                >
                  <div className="size-20 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/5 transition-all">
                    <span className="material-symbols-outlined text-5xl group-hover:rotate-90 transition-transform">add</span>
                  </div>
                  <span className="font-black text-xl uppercase tracking-[0.2em] italic">Commit Next Node</span>
                  <span className="text-[10px] font-black uppercase mt-4 tracking-widest opacity-60">Sequence Depth: {questions.length} Active Nodes</span>
                </button>
              </div>
            </section>

            {/* Form Actions */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-10 pb-20 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="size-2 bg-primary rounded-full animate-ping" />
                <p aria-live="polite" className="text-[10px] font-black text-slate-400 uppercase tracking-widest" role="status">Session Snapshot: Synced 1s Ago</p>
              </div>
              <div className="flex gap-6 w-full md:w-auto">
                <button onClick={() => navigate("/admin")} className="flex-1 md:flex-none px-10 py-5 bg-white dark:bg-slate-900 text-slate-500 font-black rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all border border-slate-100 dark:border-slate-800 active:scale-95 text-xs uppercase tracking-widest" type="button">
                  Suspend Draft
                </button>
                <button
                  className="flex-1 md:flex-none px-16 py-5 bg-primary text-white rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-primary/40 transition-all hover:-translate-y-1 active:translate-y-0.5 shadow-xl shadow-primary/20 tracking-tighter italic disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Initializing..." : "Deploy Assessment Batch"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* Hidden validation alert for screen readers */}
      <div aria-live="assertive" className="sr-only" id="form-validation-announcer"></div>

      {/* Question Selector Modal */}
      {isSelectorOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-[2.5rem] shadow-2xl flex flex-col border border-white/10">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
              <div>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">Select from Question Bank</h3>
                <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1">Infrastructural Repository v2.1</p>
              </div>
              <button
                onClick={() => setIsSelectorOpen(false)}
                className="size-12 flex items-center justify-center rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-8 border-b border-slate-100 dark:border-slate-800">
              <div className="relative group">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                <input
                  type="text"
                  placeholder="Filter by core content or subject..."
                  className="w-full pl-16 pr-6 py-5 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl focus:border-primary outline-none font-bold italic"
                  value={selectorSearch}
                  onChange={(e) => setSelectorSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-4">
              {selectorLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Syncing Repository...</p>
                </div>
              ) : bankQuestions.length === 0 ? (
                <div className="text-center py-20">
                  <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">database_off</span>
                  <p className="text-xl font-bold text-slate-500 italic">No nodes available in memory.</p>
                </div>
              ) : (
                bankQuestions
                  .filter(q => q.text.toLowerCase().includes(selectorSearch.toLowerCase()) || q.subject.toLowerCase().includes(selectorSearch.toLowerCase()))
                  .map((q) => (
                    <div key={q._id} className="p-6 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border-2 border-slate-100 dark:border-slate-800 hover:border-primary/30 transition-all flex items-center justify-between group">
                      <div className="flex-1 pr-6">
                        <div className="flex gap-3 mb-2">
                          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[9px] font-black uppercase tracking-widest">{q.subject}</span>
                          <span className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-500 rounded-full text-[9px] font-black uppercase tracking-widest">{q.difficulty}</span>
                        </div>
                        <p className="font-bold text-slate-800 dark:text-slate-200 italic line-clamp-1">{q.text}</p>
                      </div>
                      <button
                        onClick={() => handleAddFromBank(q)}
                        className="px-6 py-3 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 group-hover:scale-105 active:scale-95 transition-all"
                      >
                        Inject Node
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

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

export default CreateExam;
