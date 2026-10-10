'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step2PerformerSchema } from '@/lib/schemas';
import FormField from '@/components/wizard/FormField';
import useWizardStore from '@/store/wizardStore';

export default function Step2Performer({ onNext, onBack }) {
  const { data, setStepData } = useWizardStore();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(step2PerformerSchema),
    defaultValues: data.step2 || {
      performerType: '',
      genres: [],
      durationMinutes: '',
      numberOfPerformers: ''
    }
  });

  const genreOptions = [
    'Jazz',
    'Pop',
    'Rock',
    'Classical',
    'Hip Hop',
    'Country',
    'Electronic',
    'R&B',
    'Folk',
    'Other'
  ];

  const onSubmit = (formData) => {
    setStepData(2, formData);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormField
        label="Performer Type"
        name="performerType"
        register={register}
        error={errors.performerType}
        required
        placeholder="e.g., Band, DJ, Solo Artist"
      />

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          Genres <span className="text-starlit">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {genreOptions.map((genre) => (
            <label key={genre} className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                value={genre}
                {...register('genres')}
                className="mr-2 w-4 h-4 text-moonstone rounded focus:ring-moonstone focus:ring-offset-dark-800 bg-dark-700 border-dark-600"
              />
              <span className="text-gray-300 group-hover:text-moonstone transition-colors">{genre}</span>
            </label>
          ))}
        </div>
        {errors.genres && (
          <p className="mt-1 text-sm text-red-400">{errors.genres.message}</p>
        )}
      </div>

      <FormField
        label="Duration (minutes)"
        name="durationMinutes"
        type="number"
        register={register}
        error={errors.durationMinutes}
        required
        placeholder="e.g., 180"
      />

      <FormField
        label="Number of Performers"
        name="numberOfPerformers"
        type="number"
        register={register}
        error={errors.numberOfPerformers}
        required
        placeholder="e.g., 5"
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
