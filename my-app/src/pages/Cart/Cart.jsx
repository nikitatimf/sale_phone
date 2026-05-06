import { useEffect, useState } from "react";
import "./cart.css";
import { Link } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState([]);

  const userId = localStorage.getItem("userId");

  // 📦 загрузка корзины
  const loadCart = async () => {
    if (!userId) return;

    const res = await fetch(`http://localhost:5000/api/cart/${userId}`);
    const data = await res.json();
    setCart(data);
  };

  useEffect(() => {
    loadCart();
  }, []);

  // ❌ удалить товар
  const removeFromCart = async (phoneId) => {
    await fetch(`http://localhost:5000/api/cart/${userId}/${phoneId}`, {
      method: "DELETE"
    });

    loadCart();
  };

  // 💰 подсчёт суммы
  const total = cart.reduce((sum, item) => {
    const price = parseInt(item.price.replace("$", ""));
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className="cart">
      {/* 🔝 NAVBAR */}
      <nav className="navbar">
        <h1>🛒 Cart</h1>
        <Link to="/main">← Back to shop</Link>
      </nav>

      {/* 📦 CONTENT */}
      <div className="cart-container">

        {/* 🛍 список товаров */}
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

        {/* 💰 итог */}
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