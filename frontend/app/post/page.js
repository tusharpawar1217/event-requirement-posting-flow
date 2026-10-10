'use client';

import { useState, useEffect } from 'react';
import useWizardStore from '@/store/wizardStore';
import Stepper from '@/components/wizard/Stepper';
import Step1Basics from '@/components/steps/Step1Basics';
import Step2Planner from '@/components/steps/Step2Planner';
import Step2Performer from '@/components/steps/Step2Performer';
import Step2Crew from '@/components/steps/Step2Crew';
import Step3Planner from '@/components/steps/Step3Planner';
import Step3Performer from '@/components/steps/Step3Performer';
import Step3Crew from '@/components/steps/Step3Crew';
import Step4Review from '@/components/steps/Step4Review';

const STEP2_COMPONENTS = {
  planner: Step2Planner,
  performer: Step2Performer,
  crew: Step2Crew
};

const STEP3_COMPONENTS = {
  planner: Step3Planner,
  performer: Step3Performer,
  crew: Step3Crew
};

export default function PostRequirement() {
  const { step, data, setStep } = useWizardStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleEditStep = (stepNum) => {
    setStep(stepNum);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-400">Loading...</div>
      </div>
    );
  }

  const category = data.step1?.category;
  const Step2Component = category ? STEP2_COMPONENTS[category] : null;
  const Step3Component = category ? STEP3_COMPONENTS[category] : null;

  return (
    <main className="min-h-screen py-12 px-4 relative">
      {/* Cosmic background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-1 h-1 bg-starlit rounded-full top-[10%] left-[10%] animate-pulse"></div>
        <div className="absolute w-1 h-1 bg-moonstone rounded-full top-[20%] right-[15%] animate-pulse delay-100"></div>
        <div className="absolute w-2 h-2 bg-starlit/50 rounded-full bottom-[20%] left-[20%] animate-pulse delay-200"></div>
        <div className="absolute w-1 h-1 bg-moonstone/70 rounded-full top-[70%] right-[25%] animate-pulse"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 via-moonstone to-starlit rounded-2xl flex items-center justify-center shadow-2xl shadow-starlit/20 mb-4 mx-auto border border-starlit/30">
            <svg className="w-10 h-10 text-cosmic" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-starlit via-moonstone to-starlit bg-clip-text text-transparent">
            Post a Requirement
          </h1>
        </div>

        <Stepper currentStep={step} totalSteps={4} />

        <div className="card p-8">
          {step === 1 && <Step1Basics onNext={handleNext} />}
          
          {step === 2 && Step2Component && (
            <Step2Component onNext={handleNext} onBack={handleBack} />
          )}
          
          {step === 3 && Step3Component && (
            <Step3Component onNext={handleNext} onBack={handleBack} />
          )}
          
          {step === 4 && (
            <Step4Review onBack={handleBack} onEditStep={handleEditStep} />
          )}
        </div>
      </div>
    </main>
  );
}
