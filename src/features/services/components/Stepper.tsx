interface Props {
  currentStep: number;
}

const stepsConfig = [
  { label: "Layanan", stepNum: 1 },
  { label: "Pengiriman", stepNum: 2 },
  { label: "Data Diri", stepNum: 3 },
  { label: "Pembayaran", stepNum: 4 },
  { label: "Ringkasan", stepNum: 5 },
];

export default function Stepper({ currentStep }: Props) {
  return (
    <div className="w-full bg-gray-50 border-b px-6 py-4 flex items-center justify-between">
      <div className="flex items-center w-full max-w-2xl mx-auto justify-between relative">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
        
        {/* Active Progress Line */}
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-300" 
          style={{ width: `${((currentStep - 1) / (stepsConfig.length - 1)) * 100}%` }}
        />
        
        {stepsConfig.map((s) => {
          const isActive = currentStep === s.stepNum;
          const isCompleted = currentStep > s.stepNum;
          return (
            <div key={s.stepNum} className="flex flex-col items-center relative z-10">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs transition-all duration-300 ${
                  isCompleted 
                    ? "bg-blue-600 text-white" 
                    : isActive 
                    ? "bg-blue-600 text-white ring-4 ring-blue-100" 
                    : "bg-white border-2 border-gray-300 text-gray-400"
                }`}
              >
                {isCompleted ? "✓" : s.stepNum}
              </div>
              <span 
                className={`text-[10px] mt-1.5 font-medium transition-all duration-300 hidden sm:block ${
                  isActive || isCompleted ? "text-blue-600 font-bold" : "text-gray-400"
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
