'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step3PlannerSchema } from '@/lib/schemas';
import FormField from '@/components/wizard/FormField';
import useWizardStore from '@/store/wizardStore';

export default function Step3Planner({ onNext, onBack }) {
  const { data, setStepData } = useWizardStore();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(step3PlannerSchema),
    defaultValues: data.step3 || {
      theme: '',
      notes: '',
      needsVendorCoordination: false,
      preferredContactTime: ''
    }
  });

  const onSubmit = (formData) => {
    setStepData(3, formData);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormField
        label="Theme (Optional)"
        name="theme"
        register={register}
        error={errors.theme}
        placeholder="e.g., Elegant, Casual, Formal"
      />

      <FormField
        label="Additional Notes (Optional)"
        name="notes"
        type="textarea"
        register={register}
        error={errors.notes}
        placeholder="Any special requirements or additional information..."
      />

      <div>
        <label className="flex items-center cursor-pointer group">
          <input
            type="checkbox"
            {...register('needsVendorCoordination')}
            className="mr-2 w-4 h-4 text-starlit rounded focus:ring-starlit focus:ring-offset-dark-800 bg-dark-700 border-dark-600"
          />
          <span className="text-sm font-medium text-gray-300 group-hover:text-starlit transition-colors">
            Needs Vendor Coordination
          </span>
        </label>
      </div>

      <FormField
        label="Preferred Contact Time (Optional)"
        name="preferredContactTime"
        register={register}
        error={errors.preferredContactTime}
        placeholder="e.g., Mornings, Weekends"
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
