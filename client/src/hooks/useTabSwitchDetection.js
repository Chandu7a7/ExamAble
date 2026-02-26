import { useEffect, useState } from "react";

/**
 * Detects tab switches / visibility changes during an exam session.
 * - Shows warning (via state)
 * - Uses Web Speech API to announce warnings (if available)
 * - After 3 violations calls onAutoSubmit
 * - Logs violations to backend
 */
const useTabSwitchDetection = ({ examId, studentId, onAutoSubmit }) => {
  const [warningCount, setWarningCount] = useState(0);
  const [isWarningOpen, setIsWarningOpen] = useState(false);

  const speak = (text) => {
    if (typeof window === "undefined") return;
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const logViolation = async (type) => {
    try {
      await fetch("/api/violations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          examId,
          type,
          timestamp: new Date().toISOString()
        })
      });
    } catch {
      // fail silently for now
    }
  };

  const triggerWarning = (type) => {
    setWarningCount((prev) => {
      const next = prev + 1;
      if (next === 1) {
        speak("Warning. Tab switching is not allowed during the exam.");
      } else if (next >= 3) {
        speak("Multiple violations detected. Submitting exam.");
        if (onAutoSubmit) onAutoSubmit();
      }
      return next;
    });
    setIsWarningOpen(true);
    logViolation(type);
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerWarning("TAB_SWITCH");
      }
    };

    const handleBlur = () => {
      triggerWarning("WINDOW_BLUR");
    };

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      // Standard message ignored by most browsers but required
      e.returnValue = "Are you sure you want to leave the exam?";
    };

    const handleKeyDown = (e) => {
      // Block refresh (F5, Ctrl+R)
      if (e.key === "F5" || (e.ctrlKey && (e.key === "r" || e.key === "R"))) {
        e.preventDefault();
        triggerWarning("REFRESH_ATTEMPT");
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    const handleCopy = (e) => {
      e.preventDefault();
      triggerWarning("COPY_ATTEMPT");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopy);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopy);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId, studentId]);

  const closeWarning = () => setIsWarningOpen(false);

  return {
    warningCount,
    isWarningOpen,
    closeWarning
  };
};

export default useTabSwitchDetection;

