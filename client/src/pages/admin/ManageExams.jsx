import API_BASE from "../../api.js";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar.jsx";

const ManageExams = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/exams`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch exams");
      const data = await response.json();
      setExams(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;

    try {
      const response = await fetch(`${API_BASE}/api/exams/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete exam");
      setExams(exams.filter((exam) => exam._id !== id));
      alert("Exam deleted successfully");
    } catch (err) {
      alert(err.message);
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "SCHEDULED": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "COMPLETED": return "bg-slate-500/10 text-slate-500 border-slate-500/20";
      default: return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    }
  };

  const filteredExams = exams
    .filter((exam) => {
      const matchesSearch = exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam._id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === "all" || exam.status?.toLowerCase() === filterStatus.toLowerCase();
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return 0;
    });

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased selection:bg-primary/30 min-h-screen flex">
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-background-light dark:bg-background-dark overflow-y-auto">
        {/* Header */}
        <header className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl px-10 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <span className="material-symbols-outlined text-2xl font-black">description</span>
            </div>
            <h2 className="text-xl font-black tracking-tight uppercase italic">Module Repository</h2>
          </div>
          <div className="flex items-center gap-6">
            <button aria-label="Notifications" className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all active:scale-90 relative">
              <span className="material-symbols-outlined text-2xl">notifications</span>
              <span className="absolute top-2.5 right-2.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800" />
            <button
              onClick={() => navigate("/admin/create-exam")}
              className="px-8 py-3 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Initialize Node
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="p-12 max-w-[1400px] mx-auto w-full space-y-12 animate-in fade-in slide-in-from-bottom duration-700">
          <div className="space-y-4">
            <div className="inline-flex items-center px-4 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] border border-primary/20">
              Deployment Console
            </div>
            <h1 className="text-6xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
              Manage Assets
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xl font-medium max-w-2xl border-l-4 border-primary pl-6 py-1 italic">
              Active assessment nodes performing within standard inclusive benchmarks.
            </p>
          </div>

          {/* Search and Filters */}
          <section aria-labelledby="filter-heading" className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800">
            <h3 className="sr-only" id="filter-heading">Search and Filter Exams</h3>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="relative flex-1 group">
                <label className="sr-only" htmlFor="search-exams">Search exams by title or ID</label>
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-400 group-focus-within/input:text-primary transition-colors">
                  <span aria-hidden="true" className="material-symbols-outlined text-2xl">search</span>
                </div>
                <input
                  className="w-full h-16 pl-16 pr-8 bg-slate-50/50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-3xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold text-lg outline-none"
                  id="search-exams"
                  placeholder="Query Infrastructure Components..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-slate-50/50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-8 font-black text-[10px] uppercase tracking-widest focus:ring-4 focus:ring-primary/10 outline-none cursor-pointer"
                >
                  <option value="all">Global Status</option>
                  <option value="active">Active Nodes</option>
                  <option value="scheduled">Planned Phase</option>
                  <option value="completed">Archived Hubs</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50/50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-8 font-black text-[10px] uppercase tracking-widest focus:ring-4 focus:ring-primary/10 outline-none cursor-pointer"
                >
                  <option value="newest">Latest First</option>
                  <option value="title">Alphabetical</option>
                </select>
              </div>
            </div>
          </section>

          {/* Exams Table */}
          <section aria-labelledby="exams-table-heading" className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden p-2">
            <h3 className="sr-only" id="exams-table-heading">Table of all exams</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800/50">
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400" scope="col">Node Identity</th>
                    <th className="px-10 py-8 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400" scope="col">Operational State</th>
                    <th className="px-10 py-8 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400" scope="col">Capacity</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400" scope="col">Calibration Date</th>
                    <th className="px-10 py-8 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400" scope="col">Node Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-10 py-20 text-center text-slate-400 font-black uppercase tracking-[0.3em]">
                        Synchronizing Neural Network...
                      </td>
                    </tr>
                  ) : filteredExams.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-10 py-20 text-center text-slate-400 font-black uppercase tracking-[0.3em]">
                        No active nodes found in this sector.
                      </td>
                    </tr>
                  ) : filteredExams.map((exam) => (
                    <tr key={exam._id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all cursor-default">
                      <td className="px-10 py-8">
                        <div className="space-y-1">
                          <p className="font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors text-lg tracking-tight italic">{exam.title}</p>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{exam._id.slice(-8).toUpperCase()}</div>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-center">
                        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${getStatusStyle(exam.status)}`} role="status">
                          {exam.status || "ACTIVE"}
                        </span>
                      </td>
                      <td className="px-10 py-8 text-center">
                        <span className="font-black text-slate-600 dark:text-slate-400 text-lg tracking-tighter">{exam.questions?.length || 0} Qs</span>
                      </td>
                      <td className="px-10 py-8">
                        <span className="font-bold text-slate-500 dark:text-slate-400 text-sm whitespace-nowrap">
                          {new Date(exam.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => navigate(`/admin/edit-exam/${exam._id}`)}
                            aria-label={`Edit ${exam.title}`} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-primary hover:bg-primary/5 transition-all active:scale-90 group/btn"
                          >
                            <span aria-hidden="true" className="material-symbols-outlined font-black">edit_square</span>
                          </button>
                          <button
                            onClick={() => navigate(`/admin/results/${exam._id}`)}
                            aria-label={`View Results for ${exam.title}`} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all active:scale-90 group/btn"
                          >
                            <span aria-hidden="true" className="material-symbols-outlined font-black">assessment</span>
                          </button>
                          <button
                            onClick={() => handleDelete(exam._id)}
                            aria-label={`Delete ${exam.title}`} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all active:scale-90 group/btn"
                          >
                            <span aria-hidden="true" className="material-symbols-outlined font-black">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <nav aria-label="Table pagination" className="bg-slate-50/50 dark:bg-slate-800/30 px-10 py-8 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Segment <span className="text-primary">{filteredExams.length > 0 ? 1 : 0}</span> — <span className="text-primary">{filteredExams.length}</span> of <span className="text-primary">{exams.length}</span> active nodes
              </div>
              <div className="flex gap-4">
                <button aria-label="Previous page" className="px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95" disabled>Prev Node</button>
                <button aria-label="Next page" className="px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-primary rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 shadow-sm">Next Node</button>
              </div>
            </nav>
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

export default ManageExams;
