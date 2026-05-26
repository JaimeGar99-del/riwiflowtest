import { BASE_URL } from "../api/config.js";

export const getTasks    = () => fetch(`${BASE_URL}/tasks`).then(r => r.json());
export const getTaskById = (id) => fetch(`${BASE_URL}/tasks/${id}`).then(r => r.json());
export const getUsers    = () => fetch(`${BASE_URL}/users`).then(r => r.json());

export async function createTask(task) {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  return res.json();
}

export async function updateTask(id, data) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteTask(id) {
  await fetch(`${BASE_URL}/tasks/${id}`, { method: "DELETE" });
}