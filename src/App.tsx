import { useEffect, useMemo, useState } from 'react';
import Filters from './components/Filters';
import ContactsTable from './components/ContactsTable';
import ContactForm from './components/ContactForm';
import {
  createContact,
  deleteContact,
  getContact,
  getContacts,
  updateContact,
} from './api/contactsApi';
import type { Contact, ContactInput, ContactStatus } from './types/contact';

type View =
  | { kind: 'list' }
  | { kind: 'form'; mode: 'create' | 'edit'; id?: string };

export default function App() {
  const [view, setView] = useState<View>({ kind: 'list' });

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editing, setEditing] = useState<Contact | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | ContactStatus>('all');

  async function load() {
    try {
      setError(null);
      setLoading(true);
      const data = await getContacts();
      setContacts(data);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load contacts');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return contacts
      .filter((c) => (status === 'all' ? true : c.status === status))
      .filter((c) =>
        q
          ? c.name.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q)
          : true
      );
  }, [contacts, search, status]);

  async function handleDelete(id: string) {
    if (!confirm('Delete this contact?')) return;

    try {
      await deleteContact(id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } catch (e: any) {
      setError(e?.message ?? 'Failed to delete');
    }
  }

  async function handleEdit(id: string) {
    try {
      setLoading(true);
      const data = await getContact(id);
      setEditing(data);
      setView({ kind: 'form', mode: 'edit', id });
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load contact');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(data: ContactInput) {
    if (view.kind !== 'form') return;

    try {
      if (view.mode === 'create') {
        const created = await createContact(data);
        setContacts((prev) => [created, ...prev]);
      } else if (view.id) {
        const updated = await updateContact(view.id, data);
        setContacts((prev) =>
          prev.map((c) => (c.id === updated.id ? updated : c))
        );
      }

      setView({ kind: 'list' });
      setEditing(null);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to save');
    }
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="m-0">CRM Contacts</h3>

        {view.kind === 'list' && (
          <button
            className="btn btn-primary"
            onClick={() => setView({ kind: 'form', mode: 'create' })}
          >
            Add Contact
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading && (
        <div className="d-flex align-items-center gap-2 mb-3">
          <div className="spinner-border" />
          <div>Loading...</div>
        </div>
      )}

      {view.kind === 'list' ? (
        <div className="d-flex flex-column gap-3">
          <Filters
            search={search}
            status={status}
            onSearchChange={setSearch}
            onStatusChange={setStatus}
          />
          <ContactsTable
            contacts={filtered}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      ) : (
        <ContactForm
          mode={view.mode}
          initial={editing}
          onSave={handleSave}
          onCancel={() => {
            setView({ kind: 'list' });
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
