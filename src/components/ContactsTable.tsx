import type { Contact } from '../types/contact';

type Props = {
  contacts: Contact[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function ContactsTable({ contacts, onEdit, onDelete }: Props) {
  return (
    <div className="table-responsive">
      <table className="table table-striped align-middle">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Company</th>
            <th>Status</th>
            <th style={{ width: 160 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-muted">
                No contacts
              </td>
            </tr>
          ) : (
            contacts.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>{c.company ?? '—'}</td>
                <td>
                  <span className={`badge ${c.status === 'active' ? 'text-bg-success' : 'text-bg-secondary'}`}>
                    {c.status}
                  </span>
                </td>
                <td className="d-flex gap-2">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => onEdit(c.id)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(c.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
