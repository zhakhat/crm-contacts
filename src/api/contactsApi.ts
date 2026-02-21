// Подключаем axios — это инструмент для HTTP-запросов (общение с сервером)
import axios from 'axios';

// Подключаем типы, чтобы не использовать any и строго знать структуру данных
import type { Contact, ContactInput } from '../types/contact';

// Создаём настроенный экземпляр axios
// Чтобы не писать каждый раз полный URL и заголовки
const api = axios.create({
  baseURL: 'http://localhost:3001', // адрес нашего mock-сервера
  headers: { 'Content-Type': 'application/json' }, // говорим серверу, что шлём JSON
});


// Получить ВСЕ контакты
// Просто делаем GET запрос на /contacts
export async function getContacts(): Promise<Contact[]> {
  const res = await api.get<Contact[]>('/contacts'); // ждём ответ сервера
  return res.data; // возвращаем только данные, без лишнего
}


// Получить один контакт по id
// GET /contacts/:id
export async function getContact(id: string): Promise<Contact> {
  const res = await api.get<Contact>(`/contacts/${id}`);
  return res.data;
}


// Создать новый контакт
export async function createContact(input: ContactInput): Promise<Contact> {

  // В mock API сервер сам не создаёт id и даты,
  // поэтому мы делаем это на клиенте
  const now = new Date().toISOString();

  const payload: Contact = {
    id: crypto.randomUUID(), // генерим уникальный id
    ...input, // берём данные из формы
    createdAt: now,
    updatedAt: now,
  };

  // POST отправляет новый объект на сервер
  const res = await api.post<Contact>('/contacts', payload);

  return res.data; // сервер возвращает созданный объект
}


// Обновить существующий контакт
export async function updateContact(id: string, input: ContactInput): Promise<Contact> {

  // Сначала получаем текущую версию контакта
  // чтобы не потерять какие-то поля
  const existing = await getContact(id);

  // Объединяем старые данные с новыми
  const payload: Contact = {
    ...existing,
    ...input, // перезаписываем изменённые поля
    updatedAt: new Date().toISOString(), // обновляем дату изменения
  };

  // PUT полностью заменяет объект на сервере
  const res = await api.put<Contact>(`/contacts/${id}`, payload);

  return res.data;
}


// Удалить контакт
export async function deleteContact(id: string): Promise<void> {
  // DELETE удаляет запись по id
  await api.delete(`/contacts/${id}`);
}
