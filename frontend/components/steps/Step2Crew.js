'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step2CrewSchema } from '@/lib/schemas';
import FormField from '@/components/wizard/FormField';
import useWizardStore from '@/store/wizardStore';

export default function Step2Crew({ onNext, onBack }) {
  const { data, setStepData } = useWizardStore();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(step2CrewSchema),
    defaultValues: data.step2 || {
      crewRoles: [],
      crewCount: '',
      shiftStart: '',
      shiftEnd: ''
    }
  });

  const rolesOptions = [
    'Stage Hands',
    'Security',
    'Ushers',
    'Technical Crew',
    'Catering Staff',
    'Cleanup Crew',
    'Parking Attendants',
    'Other'
  ];

  const onSubmit = (formData) => {
    setStepData(2, formData);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          Crew Roles <span className="text-starlit">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {rolesOptions.map((role) => (
            <label key={role} className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                value={role}
                {...register('crewRoles')}
                className="mr-2 w-4 h-4 text-starlit rounded focus:ring-starlit focus:ring-offset-dark-800 bg-dark-700 border-dark-600"
              />
              <span className="text-gray-300 group-hover:text-starlit transition-colors">{role}</span>
            </label>
          ))}
        </div>
        {errors.crewRoles && (
          <p className="mt-1 text-sm text-red-400">{errors.crewRoles.message}</p>
        )}
      </div>

      <FormField
        label="Crew Count"
        name="crewCount"
        type="number"
        register={register}
        error={errors.crewCount}
        required
        placeholder="Number of crew members needed"
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Shift Start"
          name="shiftStart"
          type="time"
          register={register}
          error={errors.shiftStart}
          required
        />
        <FormField
          label="Shift End"
          name="shiftEnd"
          type="time"
          register={register}
          error={errors.shiftEnd}
          required
        />
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="btn-neutral"
        >
          Back
        </button>
        <button
          type="submit"
          className="btn-primary"
        >
          Next
        </button>
      </div>
    </form>
  );
}
