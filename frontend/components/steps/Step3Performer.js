'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step3PerformerSchema } from '@/lib/schemas';
import FormField from '@/components/wizard/FormField';
import useWizardStore from '@/store/wizardStore';

export default function Step3Performer({ onNext, onBack }) {
  const { data, setStepData } = useWizardStore();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(step3PerformerSchema),
    defaultValues: data.step3 || {
      feePerPerformer: '',
      equipmentProvidedByHost: false,
      equipmentNotes: '',
      stageSize: '',
      specialRequests: ''
    }
  });

  const onSubmit = (formData) => {
    setStepData(3, formData);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormField
        label="Fee Per Performer"
        name="feePerPerformer"
        type="number"
        register={register}
        error={errors.feePerPerformer}
        required
        placeholder="Amount in USD"
      />

      <div>
        <label className="flex items-center cursor-pointer group">
          <input
            type="checkbox"
            {...register('equipmentProvidedByHost')}
            className="mr-2 w-4 h-4 text-moonstone rounded focus:ring-moonstone focus:ring-offset-dark-800 bg-dark-700 border-dark-600"
          />
          <span className="text-sm font-medium text-gray-300 group-hover:text-moonstone transition-colors">
            Equipment Provided by Host
          </span>
        </label>
      </div>

      <FormField
        label="Equipment Notes (Optional)"
        name="equipmentNotes"
        type="textarea"
        register={register}
        error={errors.equipmentNotes}
        placeholder="Details about equipment needs or availability..."
      />

      <FormField
        label="Stage Size (Optional)"
        name="stageSize"
        register={register}
        error={errors.stageSize}
        placeholder="e.g., 20x15 feet"
      />

      <FormField
        label="Special Requests (Optional)"
        name="specialRequests"
        type="textarea"
        register={register}
        error={errors.specialRequests}
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
