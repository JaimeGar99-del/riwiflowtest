import { BASE_URL } from "../api/config.js";

export async function loginUser(email, password) {
  const res = await fetch(`${BASE_URL}/users?email=${encodeURIComponent(email)}`);
  if (!res.ok) return null;
  const users = await res.json();
  const user = users.find(
    (u) => u.email === email && u.password === password
  );
  return user ?? null;
}