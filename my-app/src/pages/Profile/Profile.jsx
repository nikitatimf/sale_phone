import { useEffect, useState } from "react";
import "./profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const loadProfile = async () => {
      const res = await fetch(`http://localhost:5000/api/profile/${userId}`);
      const data = await res.json();
      setUser(data);
    };

    if (userId) {
      loadProfile();
    }
  }, []);

  if (!user) {
    return <div className="profile">Loading...</div>;
  }

  return (
    <div className="profile">

      {/* 🔝 NAVBAR */}
      <nav className="navbar">
        <h1>👤 Profile</h1>
        <a href="/main">← Back</a>
      </nav>

      {/* 📦 CARD */}
      <div className="profile-card">

        <div className="avatar">
          👤
        </div>

        <h2>{user.name}</h2>
        <p>📧 {user.email}</p>
        <p>🆔 ID: {user.id}</p>
        <p>📅 Joined: {new Date(user.createdAt).toLocaleDateString()}</p>

        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
        >
          Logout
        </button>

      </div>
    </div>
  );
};

export default Profile;