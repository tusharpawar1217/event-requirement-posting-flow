'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step2PlannerSchema } from '@/lib/schemas';
import FormField from '@/components/wizard/FormField';
import useWizardStore from '@/store/wizardStore';

export default function Step2Planner({ onNext, onBack }) {
  const { data, setStepData } = useWizardStore();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(step2PlannerSchema),
    defaultValues: data.step2 || {
      servicesNeeded: [],
      guestCount: '',
      budgetMin: '',
      budgetMax: '',
      currency: 'USD'
    }
  });

  const servicesOptions = [
    'Catering',
    'Venue Booking',
    'Decoration',
    'AV Equipment',
    'Photography',
    'Entertainment',
    'Transportation',
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
          Services Needed <span className="text-starlit">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {servicesOptions.map((service) => (
            <label key={service} className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                value={service}
                {...register('servicesNeeded')}
                className="mr-2 w-4 h-4 text-starlit rounded focus:ring-starlit focus:ring-offset-dark-800 bg-dark-700 border-dark-600"
              />
              <span className="text-gray-300 group-hover:text-starlit transition-colors">{service}</span>
            </label>
          ))}
        </div>
        {errors.servicesNeeded && (
          <p className="mt-1 text-sm text-red-400">{errors.servicesNeeded.message}</p>
        )}
      </div>

      <FormField
        label="Guest Count"
        name="guestCount"
        type="number"
        register={register}
        error={errors.guestCount}
        required
        placeholder="Expected number of guests"
      />

      <div className="grid grid-cols-3 gap-4">
        <FormField
          label="Budget Min"
          name="budgetMin"
          type="number"
          register={register}
          error={errors.budgetMin}
          required
          placeholder="Minimum"
          className="col-span-1"
        />
        <FormField
          label="Budget Max"
          name="budgetMax"
          type="number"
          register={register}
          error={errors.budgetMax}
          required
          placeholder="Maximum"
          className="col-span-1"
        />
        <FormField
          label="Currency"
          name="currency"
          register={register}
          error={errors.currency}
          required
          placeholder="USD"
          className="col-span-1"
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
