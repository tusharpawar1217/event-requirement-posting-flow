export default function Stepper({ currentStep, totalSteps }) {
  return (
    <div className="w-full mb-10">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((stepNum) => (
          <div key={stepNum} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg transition-all duration-300 ${
                  stepNum <= currentStep
                    ? 'bg-gradient-to-br from-secondary-500 to-starlit text-cosmic shadow-lg shadow-starlit/30 scale-110'
                    : 'bg-dark-600 text-gray-500 border border-dark-500'
                }`}
              >
                {stepNum}
              </div>
              <div className={`mt-3 text-sm font-medium transition-colors duration-300 ${
                stepNum <= currentStep ? 'text-starlit' : 'text-gray-600'
              }`}>
                {stepNum === 1 && 'Basics'}
                {stepNum === 2 && 'Details 1'}
                {stepNum === 3 && 'Details 2'}
                {stepNum === 4 && 'Review'}
              </div>
            </div>
            {stepNum < totalSteps && (
              <div
                className={`h-1 flex-1 transition-all duration-500 rounded-full ${
                  stepNum < currentStep 
                    ? 'bg-gradient-to-r from-secondary-500 to-starlit shadow-sm shadow-starlit/30' 
                    : 'bg-dark-600'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
