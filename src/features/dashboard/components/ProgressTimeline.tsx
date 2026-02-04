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
              : "bg-gray-300";

        const circleColor = isDone
          ? "bg-green-500 text-white"
          : isWarning
            ? "bg-red-500 text-white animate-pulse"
            : isActive
              ? "bg-blue-500 text-white animate-pulse"
              : "bg-gray-100 text-gray-400";

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
                    className={`font-semibold ${
                      isDone
                        ? "text-gray-900"
                        : isWarning
                          ? "text-red-600"
                          : isActive
                            ? "text-gray-900"
                            : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-sm text-gray-500">{step.description}</p>
                </div>

                {step.date && (
                  <span className="text-xs text-gray-400">{step.date}</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
