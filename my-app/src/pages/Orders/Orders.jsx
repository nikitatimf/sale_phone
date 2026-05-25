import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [userName, setUserName] = useState("");
  
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  // загрузка имени пользователя
  const loadUser = async () => {
    if (!userId) return;

    const res = await fetch(`http://localhost:5000/api/user/${userId}`);
    const data = await res.json();
    setUserName(data.name);
  };

  useEffect(() => {
    const loadOrders = async () => {
      const res = await fetch(`http://localhost:5000/api/orders/${userId}`);
      const data = await res.json();
      setOrders(data);
    };

    loadOrders();
    loadUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <div className="orders">

      {/* 🔝 NAVBAR как на других страницах */}
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

      {/* Заголовок страницы заказов */}
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>📦 Мои заказы</h1>
      </div>

      {orders.length === 0 ? (
        <p className="empty-orders">У вас пока нет заказов</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="order-card">

            <h3>Заказ #{order.id}</h3>
            <p>Статус: {order.status}</p>
            <p>Дата: {new Date(order.createdAt).toLocaleString()}</p>

            <div className="order-items">
              {order.items.map((item) => (
                <div key={item.id} className="order-item">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <h4>{item.name}</h4>
                    <p>{item.price}</p>
                    <p>Количество: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ))
      )}
    </div>
  );
};

export default Orders;