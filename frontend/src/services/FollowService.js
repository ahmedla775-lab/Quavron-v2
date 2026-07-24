const API = `${import.meta.env.VITE_API_URL}/api/follow`;

class FollowService {
  async status(followerId, followingId) {
    const res = await fetch(
      `${API}/status/${followerId}/${followingId}`
    );

    return await res.json();
  }

  async follow(followerId, followingId) {
    const res = await fetch(`${API}/follow`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        followerId,
        followingId,
      }),
    });

    return await res.json();
  }

  async unfollow(followerId, followingId) {
    const res = await fetch(`${API}/unfollow`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        followerId,
        followingId,
      }),
    });

    return await res.json();
  }
}

export default new FollowService();
