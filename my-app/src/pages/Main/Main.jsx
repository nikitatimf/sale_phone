import { useState } from "react";
import { Link } from "react-router-dom";
import "./main.css";

const phones = [
  {
    id: 1,
    name: "iPhone 14",
    price: "$799",
    image: "https://placehold.co/200"
  },
  {
    id: 2,
    name: "Samsung Galaxy S23",
    price: "$699",
    image: "https://placehold.co/200"
  },
  {
    id: 3,
    name: "Xiaomi 13",
    price: "$599",
    image: "https://placehold.co/200"
  },
  {
    id: 4,
    name: "Google Pixel 7",
    price: "$649",
    image: "https://placehold.co/200"
  }
];

const Mainp = () => {
  const [search, setSearch] = useState("");

  // 🔍 фильтрация
  const filteredPhones = phones.filter((phone) =>
    phone.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="home">
      {/* 🔝 NAVBAR */}
      <nav className="navbar">
        <h1 className="logo">📱 Auto Shop</h1>

        <div className="nav-links">
          <a href="/main">Home</a>
          <Link to="/favorites">Favorites</Link>
          <a href="/profile">Profile</a>
        </div>
      </nav>

      {/* 🔍 SEARCH */}
      <div className="search">
        <input
          type="text"
          placeholder="Search phones..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 🛍️ PRODUCTS */}
      <div className="products">
        {filteredPhones.length > 0 ? (
          filteredPhones.map((phone) => (
            <div key={phone.id} className="card">
              <img src={phone.image} alt={phone.name} />
              <h3>{phone.name}</h3>
              <p>{phone.price}</p>
              <button>View</button>
            </div>
          ))
        ) : (
          <p>Ничего не найдено</p>
        )}
      </div>
    </div>
  );
};

export default Mainp;