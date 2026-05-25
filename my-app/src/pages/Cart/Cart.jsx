import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./cart.css";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [userName, setUserName] = useState("");

  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  // 📦 загрузка корзины
  const loadCart = async () => {
    if (!userId) return;

    const res = await fetch(`http://localhost:5000/api/cart/${userId}`);
    const data = await res.json();
    setCart(data);
  };

  // загрузка имени пользователя
  const loadUser = async () => {
    if (!userId) return;

    const res = await fetch(`http://localhost:5000/api/user/${userId}`);
    const data = await res.json();
    setUserName(data.name);
  };

  useEffect(() => {
    loadCart();
    loadUser();
  }, []);

  // удалить товар
  const removeFromCart = async (phoneId) => {
    await fetch(`http://localhost:5000/api/cart/${userId}/${phoneId}`, {
      method: "DELETE"
    });

    loadCart();
  };

  const logout = () => {
    localStorage.removeItem("userId");
    navigate("/");
  };

  // 💰 подсчёт суммы
  const total = cart.reduce((sum, item) => {
    const price = parseInt(item.price.replace("$", ""));
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className="cart">
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

      {/* Заголовок страницы корзины */}
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>🛒 Моя корзина</h1>
      </div>

      {/* CONTENT */}
      <div className="cart-container">

        {/* список товаров */}
        <div className="cart-items">
          {cart.length === 0 ? (
            <p>No items in cart</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item">

                <img src={item.image} alt={item.name} />

                <div className="cart-info">
                  <h3>{item.name}</h3>
                  <p>{item.price}</p>
                </div>

                <div className="cart-quantity">
                  <span>Qty: {item.quantity}</span>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>

              </div>
            ))
          )}
        </div>

        {/* итог */}
        <div className="cart-summary">
          <h2>Total: ${total}</h2>

          <button
            className="checkout-btn"
            onClick={() => alert("Checkout coming soon 🚀")}
          >
            Checkout
          </button>
        </div>

      </div>
    </div>
  );
};

export default Cart;