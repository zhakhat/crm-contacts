import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Contact, ContactInput } from '../types/contact';

const schema = z.object({
  name: z.string().min(2, 'Minimum 2 characters'),
  email: z.string().email('Invalid email'),
  phone: z
    .string()
    .regex(/^\+?\d{10,15}$/, "10–15 digits, optional '+' at start"),
  company: z.string().optional().or(z.literal('')),
  status: z.enum(['active', 'inactive']),
  notes: z.string().max(200, 'Max 200 characters').optional().or(z.literal('')),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  mode: 'create' | 'edit';
  initial?: Contact | null;
  onSave: (data: ContactInput) => Promise<void>;
  onCancel: () => void;
};

export default function ContactForm({ mode, initial, onSave, onCancel }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      status: 'active',
      notes: '',
    },
  });

  useEffect(() => {
    if (mode === 'edit' && initial) {
      reset({
        name: initial.name,
        email: initial.email,
        phone: initial.phone,
        company: initial.company ?? '',
        status: initial.status,
        notes: initial.notes ?? '',
      });
    }
  }, [mode, initial, reset]);

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        const payload: ContactInput = {
          name: values.name,
          email: values.email,
          phone: values.phone,
          company: values.company || undefined,
          status: values.status,
          notes: values.notes || undefined,
        };

        await onSave(payload);
      })}
      className="card p-3"
    >
      <h5 className="mb-3">
        {mode === 'create' ? 'Add Contact' : 'Edit Contact'}
      </h5>

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Name *</label>
          <input
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            {...register('name')}
          />
          {errors.name && (
            <div className="invalid-feedback">{errors.name.message}</div>
          )}
        </div>

        <div className="col-md-6">
          <label className="form-label">Email *</label>
          <input
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            {...register('email')}
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email.message}</div>
          )}
        </div>

        <div className="col-md-6">
          <label className="form-label">Phone *</label>
          <input
            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
            {...register('phone')}
          />
          {errors.phone && (
            <div className="invalid-feedback">{errors.phone.message}</div>
          )}
        </div>

        <div className="col-md-6">
          <label className="form-label">Company</label>
          <input className="form-control" {...register('company')} />
        </div>

        <div className="col-md-6">
          <label className="form-label">Status</label>
          <select className="form-select" {...register('status')}>
            <option value="active">active</option>
            <option value="inactive">inactive</option>
          </select>
        </div>

        <div className="col-12">
          <label className="form-label">Notes</label>
          <textarea
            rows={3}
            className={`form-control ${errors.notes ? 'is-invalid' : ''}`}
            {...register('notes')}
          />
          {errors.notes && (
            <div className="invalid-feedback">{errors.notes.message}</div>
          )}
        </div>
      </div>

      <div className="d-flex gap-2 mt-3">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>

        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
