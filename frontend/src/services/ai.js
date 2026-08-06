const API = import.meta.env.VITE_AI_API;

export async function think(message, userId = "guest") {
  const url =
    `${API}/api/think/${encodeURIComponent(message)}?user_id=${encodeURIComponent(userId)}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("AI request failed");
  }

  return await res.json();
}
