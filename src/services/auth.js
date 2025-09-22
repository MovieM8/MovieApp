const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export async function signup({ email, password, username }) {
  const res = await fetch(`${API_BASE}/user/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user: { email, password, username } }), // matches backend
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Signup failed");
  return data;
}
