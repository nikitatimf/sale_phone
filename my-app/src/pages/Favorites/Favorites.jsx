import { useEffect, useState } from "react";
import "./favorites.css";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  const userId = localStorage.getItem("userId");

  // 📡 загрузка избранного из БД
  const loadFavorites = async () => {
    if (!userId) return;

    const res = await fetch(`http://localhost:5000/api/favorites/${userId}`);
    const data = await res.json();
    setFavorites(data);
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  // ❌ удаление из БД
  const removeFromFavorites = async (phoneId) => {
    await fetch(`http://localhost:5000/api/favorites/${userId}/${phoneId}`, {
      method: "DELETE"
    });

    loadFavorites(); // обновляем список
  };

  return (
    <div className="favorites">
      <nav className="navbar">
        <h1>❤️ Favorites</h1>
        <a href="/main">← Back to shop</a>
      </nav>

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