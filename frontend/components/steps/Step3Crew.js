'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step3CrewSchema } from '@/lib/schemas';
import FormField from '@/components/wizard/FormField';
import useWizardStore from '@/store/wizardStore';

export default function Step3Crew({ onNext, onBack }) {
  const { data, setStepData } = useWizardStore();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(step3CrewSchema),
    defaultValues: data.step3 || {
      experienceLevel: '',
      payRate: '',
      payType: '',
      accommodationProvided: false,
      transportProvided: false,
      toolsRequired: [],
      notes: ''
    }
  });

  const experienceLevels = [
    { value: 'Entry', label: 'Entry Level' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Expert', label: 'Expert' }
  ];

  const payTypes = [
    { value: 'hourly', label: 'Hourly' },
    { value: 'daily', label: 'Daily' },
    { value: 'fixed', label: 'Fixed' }
  ];

  const toolsOptions = [
    'Radios',
    'Safety Gear',
    'Tools',
    'Uniforms',
    'Flashlights',
    'Other'
  ];

  const onSubmit = (formData) => {
    setStepData(3, formData);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormField
        label="Experience Level"
        name="experienceLevel"
        type="select"
        register={register}
        error={errors.experienceLevel}
        required
        options={experienceLevels}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Pay Rate"
          name="payRate"
          type="number"
          register={register}
          error={errors.payRate}
          required
          placeholder="Amount"
        />
        <FormField
          label="Pay Type"
          name="payType"
          type="select"
          register={register}
          error={errors.payType}
          required
          options={payTypes}
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center cursor-pointer group">
          <input
            type="checkbox"
            {...register('accommodationProvided')}
            className="mr-2 w-4 h-4 text-starlit rounded focus:ring-starlit focus:ring-offset-dark-800 bg-dark-700 border-dark-600"
          />
          <span className="text-sm font-medium text-gray-300 group-hover:text-starlit transition-colors">
            Accommodation Provided
          </span>
        </label>
        <label className="flex items-center cursor-pointer group">
          <input
            type="checkbox"
            {...register('transportProvided')}
            className="mr-2 w-4 h-4 text-starlit rounded focus:ring-starlit focus:ring-offset-dark-800 bg-dark-700 border-dark-600"
          />
          <span className="text-sm font-medium text-gray-300 group-hover:text-starlit transition-colors">
            Transport Provided
          </span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          Tools Required (Optional)
        </label>
        <div className="grid grid-cols-2 gap-3">
          {toolsOptions.map((tool) => (
            <label key={tool} className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                value={tool}
                {...register('toolsRequired')}
                className="mr-2 w-4 h-4 text-moonstone rounded focus:ring-moonstone focus:ring-offset-dark-800 bg-dark-700 border-dark-600"
              />
              <span className="text-gray-300 group-hover:text-moonstone transition-colors">{tool}</span>
            </label>
          ))}
        </div>
      </div>

      <FormField
        label="Additional Notes (Optional)"
        name="notes"
        type="textarea"
        register={register}
        error={errors.notes}
        placeholder="Any special requirements..."
      />

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
