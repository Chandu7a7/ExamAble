import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

const AdminSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const navItems = [
        { name: "Dashboard", path: "/admin", icon: "dashboard" },
        { name: "Create Exam", path: "/admin/create-exam", icon: "add_circle" },
        { name: "Question Bank", path: "/admin/question-bank", icon: "database" },
        { name: "Manage Exam", path: "/admin/manage-exams", icon: "description" },
        { name: "Report", path: "/admin/analytics", icon: "bar_chart_4_bars" },
    ];

    return (
        <aside aria-label="Main Navigation" className="w-[300px] hidden xl:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/20 backdrop-blur-xl p-6 h-screen sticky top-0 overflow-y-auto custom-scrollbar">
            <div className="mb-10 flex items-center gap-4 group cursor-pointer" onClick={() => navigate("/")}>
                <div className="bg-gradient-to-br from-primary to-primary-dark p-2.5 rounded-2xl text-white shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
                    <span aria-hidden="true" className="material-symbols-outlined text-2xl font-bold block">visibility</span>
                </div>
                <div>
                    <h2 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic decoration-primary underline decoration-2 underline-offset-4 leading-none">ExamAble</h2>
                    <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em] mt-1 italic">Admin Hub</p>
                </div>
            </div>

            <nav className="flex flex-col gap-2">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all active:scale-95 group font-bold tracking-tight text-sm ${isActive
                                    ? "bg-primary text-white shadow-xl shadow-primary/30 font-black uppercase tracking-widest text-[11px]"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-primary/5 dark:hover:bg-primary/10 hover:text-primary"
                                }`}
                        >
                            <span aria-hidden="true" className={`material-symbols-outlined ${isActive ? "font-bold" : "text-slate-400 group-hover:text-primary"} transition-colors`}>{item.icon}</span>
                            <span>{item.name}</span>
                        </Link>
                    );
                })}

                <div className="my-6 px-4">
                    <div className="border-t border-slate-100 dark:border-slate-800" />
                </div>

                <Link
                    to="/settings"
                    className="flex items-center gap-3 px-5 py-4 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95 font-bold text-sm"
                >
                    <span aria-hidden="true" className="material-symbols-outlined">settings</span>
                    <span>System Policy</span>
                </Link>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-5 py-4 rounded-2xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all active:scale-95 font-black uppercase tracking-widest text-[11px] mt-2 group"
                >
                    <span aria-hidden="true" className="material-symbols-outlined group-hover:translate-x-1 transition-transform">logout</span>
                    <span>Secure Exit</span>
                </button>
            </nav>

            <div className="mt-auto p-5 rounded-[2rem] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 border border-slate-200 dark:border-slate-800 shadow-inner">
                <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mb-4">Port Telemetry</p>
                <div className="flex items-center justify-between text-[11px] mb-3 font-bold">
                    <span className="text-slate-500 uppercase">Engine Load</span>
                    <span className="text-green-500">OPTIMAL</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden shadow-inner">
                    <div aria-valuemax="100" aria-valuemin="0" aria-valuenow="24" className="bg-primary h-full w-[24%] transition-all duration-1000" role="progressbar"></div>
                </div>
            </div>
        </aside>
    );
};

export default AdminSidebar;
