import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./product.css";

const Product = () => {
  const { id } = useParams();
  const [phone, setPhone] = useState(null);

  useEffect(() => {
    const loadPhone = async () => {
      const res = await fetch(`http://localhost:5000/api/phones/${id}`);
      const data = await res.json();
      setPhone(data);
    };

    loadPhone();
  }, [id]);

  if (!phone) return <div>Loading...</div>;

  return (
    <div className="product-page">

      {/* NAV */}
      <div className="navbar">
        <h1>📱 {phone.name}</h1>
        <a href="/main">← Back</a>
      </div>

      {/* CONTENT */}
      <div className="product-container">

        <div className="product-image">
          <img src={phone.image} alt={phone.name} />
        </div>

        <div className="product-info">
          <h2>{phone.name}</h2>
          <p className="price">{phone.price}</p>

          <p className="desc">
            This is a detailed page for {phone.name}.  
            Here you can show specs, description, reviews etc.
          </p>

          <button className="buy-btn">Add to cart</button>
          <button className="fav-btn">❤️ Add to favorites</button>
        </div>

      </div>
    </div>
  );
};

export default Product;