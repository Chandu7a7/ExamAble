import React from "react";

const VoiceAssistant = ({ title = "Voice Assistant", message, onReplay }) => {
  return (
    <section
      aria-label="Voice Assistant"
      className="mb-4 bg-slate-900 text-white rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg border-l-4 border-primary"
    >
      <div className="flex items-center gap-4">
        <div className="size-10 rounded-full bg-primary flex items-center justify-center animate-pulse">
          <span className="material-symbols-outlined text-white">graphic_eq</span>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-300">{title}</p>
          {message && <p className="text-base">{message}</p>}
        </div>
      </div>
      {onReplay && (
        <button
          type="button"
          onClick={onReplay}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all focus-visible w-full sm:w-auto shadow-md"
        >
          <span className="material-symbols-outlined text-xl">play_circle</span>
          Listen Again
        </button>
      )}
    </section>
  );
};

export default VoiceAssistant;

