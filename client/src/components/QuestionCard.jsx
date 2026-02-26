import React from "react";

const QuestionCard = ({
  questionNumber,
  totalQuestions,
  questionText,
  options,
  selectedOption,
  onSelect
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="p-8 md:p-12">
        <div className="flex items-center justify-between mb-8">
          <span className="bg-primary/10 text-primary px-4 py-1 rounded-full font-bold text-lg">
            Question {questionNumber} of {totalQuestions}
          </span>
          <button
            type="button"
            className="flex items-center gap-2 text-primary font-bold hover:underline"
          >
            <span className="material-symbols-outlined">volume_up</span>
            Read Aloud (R)
          </button>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-10 text-slate-900 dark:text-slate-100">
          {questionText}
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {options.map((opt, index) => {
            const optionNumber = index + 1;
            const isSelected = selectedOption === optionNumber;
            return (
              <button
                key={optionNumber}
                type="button"
                onClick={() => onSelect && onSelect(optionNumber)}
                className={`group flex items-center text-left p-6 rounded-2xl transition-all focus:ring-4 focus:ring-primary focus:outline-none ${
                  isSelected
                    ? "border-4 border-primary bg-primary/5"
                    : "border-2 border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-primary/5"
                }`}
              >
                <span
                  className={`flex-none w-12 h-12 flex items-center justify-center rounded-xl text-2xl font-bold mr-6 ${
                    isSelected
                      ? "bg-primary text-white"
                      : "bg-slate-100 dark:bg-slate-800 group-hover:bg-primary group-hover:text-white transition-colors"
                  }`}
                >
                  {optionNumber}
                </span>
                <span
                  className={`text-xl md:text-2xl ${
                    isSelected ? "font-bold" : "font-medium"
                  }`}
                >
                  {opt}
                </span>
                {isSelected && (
                  <span className="ml-auto material-symbols-outlined text-primary text-3xl">
                    check_circle
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;

