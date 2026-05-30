import { useEffect, useState } from "react";
import "./main.css";
import { Link, useNavigate } from "react-router-dom";

const Mainp = () => {
  const [phones, setPhones] = useState([]);

  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);

  const [sort, setSort] = useState("default");
  const [brand, setBrand] = useState("all");

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const userId = localStorage.getItem("userId");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
        if (!userId) return;

        const res = await fetch(`http://localhost:5000/api/user/${userId}`);
        const data = await res.json();

        setUserName(data.name);
    };

    loadUser();
    }, [userId]);
  
  const logout = () => {
    localStorage.removeItem("userId");
    navigate("/");
  };

  const limit = 4;

  // загрузка телефонов (пагинация)
  const loadPhones = async (pageNum) => {
  try {
    const res = await fetch(
      `http://localhost:5000/phones?page=${pageNum}&limit=${limit}`
    );

    const data = await res.json();

    const phonesData = data?.data || [];

    if (pageNum === 1) {
      setPhones(phonesData);
    } else {
      setPhones((prev) => [...prev, ...phonesData]);
    }

    const total = data?.total || 0;
    const loadedCount = (pageNum - 1) * limit + phonesData.length;

    if (loadedCount >= total) {
      setHasMore(false);
    }
  } catch (err) {
    console.error("loadPhones error:", err);
  }
};

  useEffect(() => {
    loadPhones(1);
  }, []);

  // ❤️ избранное
  const loadFavorites = async () => {
    if (!userId) return;

    const res = await fetch(`http://localhost:5000/api/favorites/${userId}`);
    const data = await res.json();
    setFavorites(data);
  };

  useEffect(() => {
    if (userId) loadFavorites();
  }, [userId]);

  const toggleFavorite = async (phone) => {
    const exists = favorites.find((item) => item.id === phone.id);

    if (exists) {
      await fetch(
        `http://localhost:5000/api/favorites/${userId}/${phone.id}`,
        { method: "DELETE" }
      );
    } else {
      await fetch("http://localhost:5000/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          phoneId: phone.id,
        }),
      });
    }

    loadFavorites();
  };

  const isFavorite = (id) => {
    return favorites.some((item) => item.id === id);
  };

  const addToCart = async (phone) => {
    await fetch("http://localhost:5000/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        phoneId: phone.id,
      }),
    });
  };

  // фильтрация + сортировка
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

  return (
    <div className="home">

      {/* NAVBAR */}
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

      {/* SEARCH */}
      <div className="search">
        <input
          type="text"
          placeholder="Search phones..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* FILTERS */}
      <div className="filters">
        <select onChange={(e) => setBrand(e.target.value)}>
          <option value="all">All brands</option>
          <option value="iPhone">iPhone</option>
          <option value="Samsung">Samsung</option>
          <option value="Xiaomi">Xiaomi</option>
          <option value="Google">Google</option>
        </select>

        <select onChange={(e) => setSort(e.target.value)}>
          <option value="default">Default</option>
          <option value="low">Price: Low → High</option>
          <option value="high">Price: High → Low</option>
        </select>
      </div>

      {/* PRODUCTS */}
      <div className="products">
        {filteredPhones.map((phone) => (
          <div key={phone.id} className="card">

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

      {/* LOAD MORE */}
      {hasMore && (
        <div style={{ textAlign: "center", margin: "20px" }}>
          <button
            onClick={() => {
              const next = page + 1;
              setPage(next);
              loadPhones(next);
            }}
          >
            Load more
          </button>
        </div>
      )}

    </div>
  );
};

export default Mainp;