import React, { useEffect, useState } from "react";
import "./favorites.css";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(saved);
  }, []);

  const removeFromFavorites = (id) => {
    const updated = favorites.filter((item) => item.id !== id);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  return (
    <div className="favorites">
      {/* 🔝 NAVBAR */}
      <nav className="navbar">
        <h1>❤️ Favorites</h1>
        <a href="/main">← Back to shop</a>
      </nav>

      {/* 📦 CONTENT */}
      {favorites.length === 0 ? (
        <p className="empty">No favorite items yet</p>
      ) : (
        <div className="products">
          {favorites.map((item) => (
            <div key={item.id} className="card">
              <img src={item.image} alt={item.name} />
              <h3>{item.name}</h3>
              <p>{item.price}</p>

              <button
                    onClick={() => removeFromFavorites(item.id)}
                    className="card_button"
                >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;