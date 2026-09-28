import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useCreateUser } from '../../hooks/useCreateUser';
import { useState } from 'react';

const schema = yup
  .object({
    name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
    email: yup.string().required('Email is required').email('Must be a valid email'),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

function AddUserForm() {
  const [submitError, setSubmitError] = useState<string>('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const { mutateAsync } = useCreateUser();

  const onSubmit = async (data: FormData) => {
    setSubmitError('');
    try {
      await mutateAsync(data);
      alert('User added successfully!');
      reset();
    } catch (error) {
      setSubmitError((error as Error).message || 'Failed to add user. Please try again.');
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      aria-label="Add User Form"
      className="space-y-5 max-w-md mx-auto"
    >
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Name
        </label>
        <div className="mt-1">
          <input
            id="name"
            type="text"
            {...register('name')}
            className={`block w-full rounded-lg border px-3 py-2 text-sm placeholder-slate-400 shadow-sm outline-none transition duration-150 ease-in-out focus:ring-2 dark:placeholder-slate-500 ${
              errors.name
                ? 'border-red-300 bg-white text-slate-900 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500/50 dark:bg-slate-950 dark:text-red-200 dark:focus:ring-red-500/30'
                : 'border-slate-200 bg-white text-slate-900 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/30'
            }`}
            placeholder="John Doe"
          />
        </div>
        {errors.name && (
          <p role="alert" className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Email
        </label>
        <div className="mt-1">
          <input
            id="email"
            type="email"
            {...register('email')}
            className={`block w-full rounded-lg border px-3 py-2 text-sm placeholder-slate-400 shadow-sm outline-none transition duration-150 ease-in-out focus:ring-2 dark:placeholder-slate-500 ${
              errors.email
                ? 'border-red-300 bg-white text-slate-900 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500/50 dark:bg-slate-950 dark:text-red-200 dark:focus:ring-red-500/30'
                : 'border-slate-200 bg-white text-slate-900 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/30'
            }`}
            placeholder="john@example.com"
          />
        </div>
        {errors.email && (
          <p role="alert" className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
            {errors.email.message}
          </p>
        )}
      </div>

      {submitError && (
        <div className="">
          <p role="alert" className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
            {submitError}
          </p>
        </div>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-150 ease-in-out hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500"
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Submitting...
          </div>
        ) : (
          'Submit'
        )}
      </button>
    </form>
  );
}

export default AddUserForm;
