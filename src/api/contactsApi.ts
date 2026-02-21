import axios from 'axios';
import type { Contact, ContactInput } from '../types/contact';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: { 'Content-Type': 'application/json' },
});

export async function getContacts(): Promise<Contact[]> {
  const res = await api.get<Contact[]>('/contacts');
  return res.data;
}

export async function getContact(id: string): Promise<Contact> {
  const res = await api.get<Contact>(`/contacts/${id}`);
  return res.data;
}

export async function createContact(input: ContactInput): Promise<Contact> {
  const now = new Date().toISOString();
  const payload: Contact = {
    id: crypto.randomUUID(),
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  const res = await api.post<Contact>('/contacts', payload);
  return res.data;
}

export async function updateContact(id: string, input: ContactInput): Promise<Contact> {
  const existing = await getContact(id);
  const payload: Contact = {
    ...existing,
    ...input,
    updatedAt: new Date().toISOString(),
  };
  const res = await api.put<Contact>(`/contacts/${id}`, payload);
  return res.data;
}

export async function deleteContact(id: string): Promise<void> {
  await api.delete(`/contacts/${id}`);
}
