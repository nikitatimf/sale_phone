import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./favorites.css";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [userName, setUserName] = useState("");

  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  // 📡 загрузка избранного из БД
  const loadFavorites = async () => {
    if (!userId) return;

    const res = await fetch(`http://localhost:5000/api/favorites/${userId}`);
    const data = await res.json();
    setFavorites(data);
  };

  // загрузка имени пользователя
  const loadUser = async () => {
    if (!userId) return;

    const res = await fetch(`http://localhost:5000/api/user/${userId}`);
    const data = await res.json();
    setUserName(data.name);
  };

  useEffect(() => {
    loadFavorites();
    loadUser();
  }, []);

  // ❌ удаление из БД
  const removeFromFavorites = async (phoneId) => {
    await fetch(`http://localhost:5000/api/favorites/${userId}/${phoneId}`, {
      method: "DELETE"
    });

    loadFavorites(); // обновляем список
  };

  const logout = () => {
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <div className="favorites">
      {/* 🔝 NAVBAR как в Mainp */}
      <nav className="navbar">
        <h1 className="logo">📱 Auto Shop</h1>

        <div className="nav-links">
          <Link to="/main">Home</Link>
          <Link to="/favorites">Favorites</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/profile">Profile</Link>
        </div>

        <div className="auth-box">
          {userId ? (
            <>
              <span className="username">👤 {userName || "User"}</span>
              <button onClick={logout} className="logout-btn">
                Выйти
              </button>
            </>
          ) : (
            <Link to="/">
              <button className="login-btn">Войти</button>
            </Link>
          )}
        </div>
      </nav>

      {/* Заголовок страницы избранного */}
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>❤️ Мои избранные товары</h1>
      </div>

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