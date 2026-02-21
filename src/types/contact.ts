// Статус контакта может быть ТОЛЬКО 'active' или 'inactive'
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
// ContactInput — версия контакта, которую мы отправляем при создании/редактировании без id и дат
export type ContactInput = Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>;
