import React from "react";
import AppRoutes from "./routes.jsx";

const App = () => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      <AppRoutes />
    </div>
  );
};

export default App;

