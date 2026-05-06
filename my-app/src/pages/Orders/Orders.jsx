import { useEffect, useState } from "react";
import "./orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const loadOrders = async () => {
      const res = await fetch(`http://localhost:5000/api/orders/${userId}`);
      const data = await res.json();
      setOrders(data);
    };

    loadOrders();
  }, []);

  return (
    <div className="orders">

      <nav className="navbar">
        <h1>📦 My Orders</h1>
        <a href="/main">← Back</a>
      </nav>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="order-card">

            <h3>Order #{order.id}</h3>
            <p>Status: {order.status}</p>
            <p>Date: {new Date(order.createdAt).toLocaleString()}</p>

            <div className="order-items">
              {order.items.map((item) => (
                <div key={item.id} className="order-item">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <h4>{item.name}</h4>
                    <p>{item.price}</p>
                    <p>Qty: {item.quantity}</p>
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