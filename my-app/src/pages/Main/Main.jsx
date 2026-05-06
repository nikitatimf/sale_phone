import { useEffect, useState } from "react";
import "./main.css";
import { Link } from "react-router-dom";

const Mainp = () => {
  const [phones, setPhones] = useState([]);
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [sort, setSort] = useState("default");
  const [brand, setBrand] = useState("all");

  const userId = localStorage.getItem("userId");

  // 📡 загрузка телефонов
  useEffect(() => {
    fetch("http://localhost:5000/phones")
      .then((res) => res.json())
      .then((data) => setPhones(data))
      .catch((err) => console.error(err));
  }, []);

  // ❤️ загрузка избранного
  const loadFavorites = async () => {
    if (!userId) return;

    const res = await fetch(`http://localhost:5000/api/favorites/${userId}`);
    const data = await res.json();
    setFavorites(data);
  };

  useEffect(() => {
    if (userId) {
        loadFavorites();
    }
    }, [userId]);

  // ❤️ toggle
  const toggleFavorite = async (phone) => {
    console.log("userId:", userId);
console.log("phoneId:", phone.id);
    const exists = favorites.find((item) => item.id === phone.id);

    if (exists) {
        // 🔥 ВОТ СЮДА ВСТАВЛЯЕШЬ
        await fetch(`http://localhost:5000/api/favorites/${userId}/${phone.id}`, {
        method: "DELETE"
        });
    } else {
        await fetch("http://localhost:5000/api/favorites", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userId,
            phoneId: phone.id
        })
        });
    }

    loadFavorites();
    };

  const isFavorite = (id) => {
    return favorites.some((item) => item.id === id);
  };

  // 🔍 поиск
  const filteredPhones = phones
  .filter((phone) => {
    const matchesSearch = phone.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesBrand =
      brand === "all" || phone.name.includes(brand);

    return matchesSearch && matchesBrand;
  })
  .sort((a, b) => {
    const priceA = parseInt(a.price.replace("$", ""));
    const priceB = parseInt(b.price.replace("$", ""));

    if (sort === "low") return priceA - priceB;
    if (sort === "high") return priceB - priceA;

    return 0;
  });

  const addToCart = async (phone) => {
    await fetch("http://localhost:5000/api/cart", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
        userId,
        phoneId: phone.id
        })
    });
  };

  return (
    <div className="home">
        <nav className="navbar">
            <h1 className="logo">📱 Auto Shop</h1>

            <div className="nav-links">
                <Link to="/main">Home</Link>
                <Link to="/favorites">Favorites</Link>
                <Link to="/cart">Cart</Link>
                <Link to="/orders">My Orders</Link>
                <Link to="/profile">Profile</Link>
            </div>
        </nav>

      <div className="search">
        <input
          type="text"
          placeholder="Search phones..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="filters">
        {/* 📱 фильтр */}
        <select onChange={(e) => setBrand(e.target.value)}>
            <option value="all">All brands</option>
            <option value="iPhone">iPhone</option>
            <option value="Samsung">Samsung</option>
            <option value="Xiaomi">Xiaomi</option>
            <option value="Google">Google</option>
        </select>

        {/* 💰 сортировка */}
        <select onChange={(e) => setSort(e.target.value)}>
            <option value="default">Default</option>
            <option value="low">Price: Low → High</option>
            <option value="high">Price: High → Low</option>
        </select>
      </div>

      <div className="products">
        {filteredPhones.map((phone) => (
          <div key={phone.id} className="card">

            {/* ❤️ ИКОНКА */}
            <div
              className="favorite-icon"
              onClick={() => toggleFavorite(phone)}
            >
              {isFavorite(phone.id) ? "❤️" : "🤍"}
            </div>

            <img src={phone.image} alt={phone.name} />
            <h3>{phone.name}</h3>
            <p>{phone.price}</p>
            <button onClick={() => addToCart(phone)}>
                🛒 Add to cart
            </button>
            <Link to={`/product/${phone.id}`}>
                <button>View</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Mainp;