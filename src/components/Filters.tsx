import type { ContactStatus } from '../types/contact';

type Props = {
  search: string;
  status: 'all' | ContactStatus;
  onSearchChange: (v: string) => void;
  onStatusChange: (v: 'all' | ContactStatus) => void;
};

export default function Filters({ search, status, onSearchChange, onStatusChange }: Props) {
  return (
    <div className="d-flex gap-2 align-items-end flex-wrap">
      <div>
        <label className="form-label">Search</label>
        <input
          className="form-control"
          placeholder="Name or Email"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div>
        <label className="form-label">Status</label>
        <select
          className="form-select"
          value={status}
          onChange={(e) => onStatusChange(e.target.value as 'all' | ContactStatus)}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </div>
  );
}
