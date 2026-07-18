import { Check, Clock, FileText, AlertTriangle } from "lucide-react";

type Step = {
  title: string;
  date?: string | null;
  description: string;
  done: boolean;
  warning?: boolean;
};

export default function ProgressTimeline({ steps }: { steps: Step[] }) {
  const activeIndex = steps.findIndex((s) => !s.done && !s.warning);

  return (
    <div className="relative space-y-8">
      {steps.map((step, index) => {
        const isDone = step.done;
        const isWarning = step.warning;
        const isActive = index === activeIndex && !isWarning;
        const isLast = index === steps.length - 1;

        /* ================= COLORS ================= */
        const lineColor = isDone
          ? "bg-green-500"
          : isWarning
            ? "bg-red-500"
            : isActive
              ? "bg-blue-500"
              : "bg-slate-300 dark:bg-slate-700 transition-colors";

        const circleColor = isDone
          ? "bg-green-500 text-white"
          : isWarning
            ? "bg-red-500 text-white animate-pulse"
            : isActive
              ? "bg-blue-500 text-white animate-pulse"
              : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 transition-colors";

        return (
          <div key={index} className="flex gap-6">
            {/* LEFT: LINE + ICON */}
            <div className="relative flex flex-col items-center">
              {!isLast && (
                <div className={`absolute top-8 h-full w-px ${lineColor}`} />
              )}

              <div
                className={`z-10 flex h-8 w-8 items-center justify-center rounded-full ${circleColor}`}
              >
                {isDone && <Check size={18} />}
                {isWarning && <AlertTriangle size={18} />}
                {!isDone && !isWarning && isActive && <Clock size={18} />}
                {!isDone && !isWarning && !isActive && <FileText size={18} />}
              </div>
            </div>

            {/* RIGHT: CONTENT */}
            <div className="flex-1 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <p
                    className={`font-semibold transition-colors ${
                      isDone
                        ? "text-slate-900 dark:text-white"
                        : isWarning
                          ? "text-red-600 dark:text-red-400"
                          : isActive
                            ? "text-slate-900 dark:text-white"
                            : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors">{step.description}</p>
                </div>

                {step.date && (
                  <span className="text-xs text-slate-400 dark:text-slate-500 transition-colors">{step.date}</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
