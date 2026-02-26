import API_BASE from "../../../api.js";
import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar.jsx";
import { toast, Toaster } from "react-hot-toast";

const QuestionBank = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [aiSuggesting, setAiSuggesting] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    // Form State
    const [newQuestion, setNewQuestion] = useState({
        text: "",
        subject: "Computer Science",
        difficulty: "Medium",
        options: ["", "", "", ""],
        correctOption: 0,
        accessibilityText: "",
        image: ""
    });

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE}/api/questions`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setQuestions(data);
            } else {
                toast.error(data.message || "Failed to fetch questions");
            }
        } catch (error) {
            console.error("Error fetching questions:", error);
            toast.error("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
            setUploading(true);
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE}/api/upload`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();
            if (response.ok) {
                setNewQuestion({ ...newQuestion, image: data.url });
                toast.success("Image uploaded!");
            } else {
                toast.error(data.message || "Upload failed");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Network error during upload");
        } finally {
            setUploading(false);
        }
    };

    const generateAIDescription = async () => {
        if (!newQuestion.image) {
            toast.error("Please upload an image first");
            return;
        }

        try {
            setAiSuggesting(true);
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE}/api/ai/describe`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ imagePath: newQuestion.image })
            });

            const data = await response.json();
            if (response.ok) {
                setNewQuestion({ ...newQuestion, accessibilityText: data.description });
                toast.success("AI description generated!");
            } else {
                toast.error(data.message || "AI generation failed");
            }
        } catch (error) {
            console.error("AI error:", error);
            toast.error("Network error during AI generation");
        } finally {
            setAiSuggesting(false);
        }
    };

    const handleEditClick = (q) => {
        setEditMode(true);
        setEditId(q._id);
        setNewQuestion({
            text: q.text,
            subject: q.subject,
            difficulty: q.difficulty,
            options: q.options,
            correctOption: q.correctOption,
            accessibilityText: q.accessibilityText || "",
            image: q.image || ""
        });
        setIsModalOpen(true);
    };

    const handleSaveQuestion = async () => {
        if (!newQuestion.text || newQuestion.options.some(opt => !opt)) {
            toast.error("Please fill all fields");
            return;
        }

        try {
            setSaving(true);
            const token = localStorage.getItem("token");
            const url = editMode
                ? `${API_BASE}/api/questions/${editId}`
                : `${API_BASE}/api/questions`;

            const method = editMode ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(newQuestion)
            });

            const data = await response.json();
            if (response.ok) {
                toast.success(editMode ? "Question updated successfully" : "Question added successfully");
                setIsModalOpen(false);
                setEditMode(false);
                setEditId(null);
                setNewQuestion({
                    text: "",
                    subject: "Computer Science",
                    difficulty: "Medium",
                    options: ["", "", "", ""],
                    correctOption: 0,
                    accessibilityText: "",
                    image: ""
                });
                fetchQuestions();
            } else {
                toast.error(data.message || "Failed to save question");
            }
        } catch (error) {
            console.error("Error saving question:", error);
            toast.error("Network error. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteQuestion = async (id) => {
        if (!window.confirm("Are you sure you want to delete this question?")) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE}/api/questions/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                toast.success("Question deleted");
                fetchQuestions();
            } else {
                const data = await response.json();
                toast.error(data.message || "Failed to delete question");
            }
        } catch (error) {
            console.error("Error deleting question:", error);
            toast.error("Network error");
        }
    };

    const filteredQuestions = questions.filter(q =>
        q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased selection:bg-primary/30 min-h-screen flex">
            <Toaster position="top-right" />
            <AdminSidebar />

            {/* Main Content Area */}
            <main className="flex-1 p-8 lg:px-12 flex flex-col min-w-0 bg-background-light dark:bg-background-dark overflow-y-auto custom-scrollbar">
                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div>
                        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Question Bank</h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mt-1">Manage and organize all exam questions</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditMode(false);
                            setEditId(null);
                            setNewQuestion({
                                text: "",
                                subject: "Computer Science",
                                difficulty: "Medium",
                                options: ["", "", "", ""],
                                correctOption: 0,
                                accessibilityText: "",
                                image: ""
                            });
                            setIsModalOpen(true);
                        }}
                        aria-label="Add New Question"
                        className="bg-primary hover:bg-blue-800 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all focus:outline-none focus:ring-4 focus:ring-primary/20 active:scale-95"
                    >
                        <span className="material-symbols-outlined">add</span>
                        Add New Question
                    </button>
                </header>

                {/* Search & Filters */}
                <section aria-labelledby="filter-heading" className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm mb-10 border border-slate-200 dark:border-slate-800">
                    <h3 className="sr-only" id="filter-heading">Filters</h3>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        <div className="md:col-span-5">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2" htmlFor="search-q">Search Questions</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <span className="material-symbols-outlined">search</span>
                                </span>
                                <input
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                    id="search-q"
                                    placeholder="Keywords (e.g. CPU, logic, history)..."
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="md:col-span-3">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2" htmlFor="subject-filter">Subject</label>
                            <select className="w-full py-3 px-4 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer" id="subject-filter">
                                <option>All Subjects</option>
                                <option>Computer Science</option>
                                <option>Mathematics</option>
                                <option>General Knowledge</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2" htmlFor="difficulty-filter">Difficulty</label>
                            <select className="w-full py-3 px-4 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer" id="difficulty-filter">
                                <option>All Levels</option>
                                <option>Easy</option>
                                <option>Medium</option>
                                <option>Hard</option>
                            </select>
                        </div>
                        <div className="md:col-span-2 flex items-end">
                            <button aria-label="Clear all filters" className="w-full py-3 text-primary dark:text-blue-400 font-bold hover:bg-primary/5 rounded-xl border-2 border-primary/20 transition-all active:scale-95">
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </section>

                {/* Question List */}
                <section aria-label="Questions list" className="grid grid-cols-1 gap-6 pb-12">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Accessing Question Matrix...</p>
                        </div>
                    ) : filteredQuestions.length === 0 ? (
                        <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center">
                            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">search_off</span>
                            <p className="text-xl font-bold text-slate-600 dark:text-slate-400">No questions found matching your criteria</p>
                        </div>
                    ) : (
                        filteredQuestions.map((q) => (
                            <article key={q._id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col lg:flex-row gap-6 items-start lg:items-center hover:border-primary/30 transition-all group">
                                <div
                                    className="w-full lg:w-48 h-32 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 shadow-inner"
                                    style={{ backgroundImage: q.image ? `url('${q.image}')` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}
                                >
                                    {!q.image && <span className="material-symbols-outlined text-4xl text-slate-300">image</span>}
                                </div>
                                <div className="flex-1 space-y-3">
                                    <div className="flex flex-wrap gap-2">
                                        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${q.subject === "Computer Science" ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300" : "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300"
                                            }`}>
                                            {q.subject}
                                        </span>
                                        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${q.difficulty === "Easy" ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300" : q.difficulty === "Hard" ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300" : "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300"
                                            }`}>
                                            {q.difficulty}
                                        </span>
                                    </div>
                                    <h4 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                        {q.text}
                                    </h4>
                                    <div className="flex items-center gap-6 text-slate-500 dark:text-slate-400 text-sm">
                                        <span className="flex items-center gap-1 font-medium"><span className="material-symbols-outlined text-base">list</span> {q.options.length} Options</span>
                                        <span className="flex items-center gap-1 font-medium"><span className="material-symbols-outlined text-base">calendar_today</span> {new Date(q.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 shrink-0 self-end lg:self-center">
                                    <button aria-label="Edit question"
                                        onClick={() => handleEditClick(q)}
                                        className="p-3 bg-slate-100 dark:bg-slate-800 text-primary dark:text-blue-400 rounded-xl hover:bg-primary hover:text-white transition-all active:scale-90"
                                    >
                                        <span className="material-symbols-outlined">edit</span>
                                    </button>
                                    <button aria-label="Delete question"
                                        onClick={() => handleDeleteQuestion(q._id)}
                                        className="p-3 bg-slate-100 dark:bg-slate-800 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-600 hover:text-white transition-all active:scale-90"
                                    >
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </div>
                            </article>
                        ))
                    )}
                </section>
            </main>

            {/* Add Question Modal */}
            {isModalOpen && (
                <div aria-labelledby="modal-title" aria-modal="true" className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" role="dialog">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 custom-scrollbar border border-white/10">
                        <div className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-8 py-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center z-10">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic" id="modal-title">
                                {editMode ? "Modify Question" : "Add New Question"}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                aria-label="Close modal"
                                className="size-10 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Question Content */}
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Subject Area</label>
                                        <select
                                            value={newQuestion.subject}
                                            onChange={(e) => setNewQuestion({ ...newQuestion, subject: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-4 focus:border-primary font-bold outline-none shadow-inner"
                                        >
                                            <option>Computer Science</option>
                                            <option>Mathematics</option>
                                            <option>General Knowledge</option>
                                            <option>Physics</option>
                                            <option>Chemistry</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Difficulty Scale</label>
                                        <select
                                            value={newQuestion.difficulty}
                                            onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-4 focus:border-primary font-bold outline-none shadow-inner"
                                        >
                                            <option value="Easy">Easy</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Hard">Hard</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-2" htmlFor="q-text">Question Core Text</label>
                                    <textarea
                                        className="w-full bg-slate-50/50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-6 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold text-lg outline-none resize-none shadow-inner"
                                        id="q-text"
                                        placeholder="Enter the full question prompt..."
                                        rows="3"
                                        value={newQuestion.text}
                                        onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Visual Asset (Optional)</label>
                                        <div className="relative group/upload">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                id="q-img-upload"
                                                disabled={uploading}
                                            />
                                            <label
                                                htmlFor="q-img-upload"
                                                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 transition-all cursor-pointer ${newQuestion.image ? 'border-emerald-500 bg-emerald-50/10' : 'border-slate-200 dark:border-slate-800 hover:border-primary bg-slate-50/50 dark:bg-slate-800/50'}`}
                                            >
                                                {uploading ? (
                                                    <div className="animate-spin size-8 border-4 border-primary border-t-transparent rounded-full" />
                                                ) : newQuestion.image ? (
                                                    <div className="flex flex-col items-center gap-2">
                                                        <div className="w-full h-24 rounded-lg overflow-hidden border border-emerald-100">
                                                            <img
                                                                src={`${API_BASE}${newQuestion.image}`}
                                                                alt="Upload preview"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <span className="text-[10px] font-black text-emerald-600 uppercase">Change Image</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <span className="material-symbols-outlined text-3xl text-slate-400 mb-2">upload_file</span>
                                                        <span className="text-[10px] font-black text-slate-500 uppercase">Click to Load Asset</span>
                                                    </>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center ml-2">
                                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest" htmlFor="q-alt">Accessibility Description (Mandatory)</label>
                                            <button
                                                type="button"
                                                onClick={generateAIDescription}
                                                disabled={aiSuggesting || !newQuestion.image}
                                                className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1 hover:underline disabled:opacity-30"
                                            >
                                                {aiSuggesting ? <div className="size-3 border-2 border-primary border-t-transparent rounded-full animate-spin" /> : <span className="material-symbols-outlined text-sm">auto_awesome</span>}
                                                AI Suggest
                                            </button>
                                        </div>
                                        <textarea
                                            className="w-full bg-slate-50/50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-6 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-sm outline-none resize-none shadow-inner h-[100px]"
                                            id="q-alt"
                                            placeholder="Describe clinical content for screen readers..."
                                            rows="4"
                                            value={newQuestion.accessibilityText}
                                            onChange={(e) => setNewQuestion({ ...newQuestion, accessibilityText: e.target.value })}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            {/* Options Section */}
                            <div className="space-y-6">
                                <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic border-l-4 border-primary pl-4">Answer Matrix</h4>
                                <div className="space-y-4">
                                    {['A', 'B', 'C', 'D'].map((opt, idx) => (
                                        <div key={opt} className="flex items-center gap-4 group">
                                            <span className={`w-12 h-12 flex items-center justify-center rounded-2xl font-black shrink-0 border transition-all shadow-sm ${newQuestion.correctOption === idx ? 'bg-primary text-white border-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'}`}>{opt}</span>
                                            <input
                                                className="flex-1 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-4 focus:border-primary transition-all font-bold outline-none shadow-sm"
                                                placeholder={`Enter option ${opt} data...`}
                                                type="text"
                                                value={newQuestion.options[idx]}
                                                onChange={(e) => {
                                                    const opts = [...newQuestion.options];
                                                    opts[idx] = e.target.value;
                                                    setNewQuestion({ ...newQuestion, options: opts });
                                                }}
                                            />
                                            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 px-5 py-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                                <input
                                                    className="size-5 text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:bg-slate-700 bg-white cursor-pointer"
                                                    id={`correct-${opt}`}
                                                    name="correct-ans"
                                                    type="radio"
                                                    checked={newQuestion.correctOption === idx}
                                                    onChange={() => setNewQuestion({ ...newQuestion, correctOption: idx })}
                                                />
                                                <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest cursor-pointer" htmlFor={`correct-${opt}`}>Binary Correct</label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-slate-50/90 dark:bg-slate-800/90 backdrop-blur-md px-8 py-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-6 rounded-b-3xl">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                aria-label="Cancel adding question"
                                className="px-10 py-4 text-slate-500 font-black uppercase tracking-widest text-xs hover:bg-slate-200 dark:hover:bg-slate-700/50 rounded-2xl transition-all active:scale-95"
                                disabled={saving}
                            >
                                Cancel Node
                            </button>
                            <button
                                aria-label="Save question"
                                onClick={handleSaveQuestion}
                                disabled={saving}
                                className="px-12 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-xl shadow-emerald-600/20 transition-all hover:-translate-y-1 active:translate-y-0.5 text-xs uppercase tracking-[0.2em] italic disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? "Syncing..." : editMode ? "Update Asset" : "Commit Asset"}
                            </button>
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

export default QuestionBank;
