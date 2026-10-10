'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step1Schema } from '@/lib/schemas';
import FormField from '@/components/wizard/FormField';
import useWizardStore from '@/store/wizardStore';

export default function Step1Basics({ onNext }) {
  const { data, setStepData, setCategory } = useWizardStore();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues: data.step1 || {}
  });

  const eventType = watch('eventType');
  const dateMode = watch('dateMode');
  const selectedCategory = watch('category');

  const handleCategoryChange = (newCategory) => {
    const currentCategory = data.step1?.category;
    if (currentCategory && currentCategory !== newCategory && (data.step2 && Object.keys(data.step2).length > 0)) {
      if (confirm('Changing category will clear your progress in steps 2 and 3. Continue?')) {
        setCategory(newCategory);
      }
    } else {
      setCategory(newCategory);
    }
  };

  const onSubmit = (formData) => {
    setStepData(1, formData);
    onNext();
  };

  const eventTypes = [
    { value: 'Wedding', label: 'Wedding' },
    { value: 'Corporate', label: 'Corporate' },
    { value: 'Concert', label: 'Concert' },
    { value: 'Birthday', label: 'Birthday' },
    { value: 'Festival', label: 'Festival' },
    { value: 'Conference', label: 'Conference' },
    { value: 'Other', label: 'Other' }
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormField
        label="Event Name"
        name="eventName"
        register={register}
        error={errors.eventName}
        required
        placeholder="e.g., Annual Company Gala"
      />

      <FormField
        label="Event Type"
        name="eventType"
        type="select"
        register={register}
        error={errors.eventType}
        required
        options={eventTypes}
      />

      {eventType === 'Other' && (
        <FormField
          label="Specify Event Type"
          name="eventTypeOther"
          register={register}
          error={errors.eventTypeOther}
          required
          placeholder="e.g., Charity Fundraiser"
        />
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Date Mode <span className="text-starlit">*</span>
        </label>
        <div className="flex gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              {...register('dateMode')}
              value="single"
              className="mr-2 w-4 h-4 text-starlit focus:ring-starlit focus:ring-offset-dark-800"
            />
            <span className="text-gray-300">Single Date</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              {...register('dateMode')}
              value="range"
              className="mr-2 w-4 h-4 text-starlit focus:ring-starlit focus:ring-offset-dark-800"
            />
            <span className="text-gray-300">Date Range</span>
          </label>
        </div>
        {errors.dateMode && <p className="mt-1 text-sm text-red-400">{errors.dateMode.message}</p>}
      </div>

      {dateMode === 'single' && (
        <FormField
          label="Event Date"
          name="eventDate"
          type="datetime-local"
          register={register}
          error={errors.eventDate}
          required
        />
      )}

      {dateMode === 'range' && (
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Start Date"
            name="startDate"
            type="datetime-local"
            register={register}
            error={errors.startDate}
            required
          />
          <FormField
            label="End Date"
            name="endDate"
            type="datetime-local"
            register={register}
            error={errors.endDate}
            required
          />
        </div>
      )}

      <FormField
        label="Location"
        name="location"
        register={register}
        error={errors.location}
        required
        placeholder="City or Address"
      />

      <FormField
        label="Venue (Optional)"
        name="venue"
        register={register}
        error={errors.venue}
        placeholder="Venue name"
      />

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          Category <span className="text-starlit">*</span>
        </label>
        <div className="grid grid-cols-3 gap-4">
          {['planner', 'performer', 'crew'].map((cat) => (
            <label
              key={cat}
              className={`relative flex flex-col items-center justify-center p-6 border-2 rounded-2xl cursor-pointer transition-all ${
                selectedCategory === cat
                  ? 'border-starlit bg-gradient-to-br from-starlit/10 to-moonstone/10 shadow-lg shadow-starlit/20 scale-105 backdrop-blur-sm'
                  : 'border-dark-600 hover:border-dark-500 hover:bg-dark-700/50'
              }`}
            >
              <input
                type="radio"
                {...register('category')}
                value={cat}
                className="sr-only"
                onChange={(e) => {
                  register('category').onChange(e);
                  handleCategoryChange(cat);
                }}
              />
              <div className="text-4xl mb-2">
                {cat === 'planner' && '📋'}
                {cat === 'performer' && '🎤'}
                {cat === 'crew' && '👷'}
              </div>
              <div className={`font-semibold capitalize ${
                selectedCategory === cat ? 'text-starlit' : 'text-gray-400'
              }`}>{cat}</div>
            </label>
          ))}
        </div>
        {errors.category && <p className="mt-1 text-sm text-red-400">{errors.category.message}</p>}
      </div>

      <div className="flex justify-end">
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
