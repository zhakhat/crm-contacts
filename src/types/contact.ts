export type ContactStatus = 'active' | 'inactive';

export type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  status: ContactStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type ContactInput = Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>;
