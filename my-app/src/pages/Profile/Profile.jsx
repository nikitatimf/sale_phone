import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  // загрузка имени пользователя для навбара
  const loadUser = async () => {
    if (!userId) return;

    const res = await fetch(`http://localhost:5000/api/user/${userId}`);
    const data = await res.json();
    setUserName(data.name);
  };

  useEffect(() => {
    const loadProfile = async () => {
      const res = await fetch(`http://localhost:5000/api/profile/${userId}`);
      const data = await res.json();
      setUser(data);
      setFormData({
        ...formData,
        name: data.name,
        email: data.email
      });
    };

    if (userId) {
      loadProfile();
      loadUser();
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("userId");
    navigate("/");
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setMessage({ text: "", type: "" });
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData({
      ...formData,
      name: user.name,
      email: user.email,
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setMessage({ text: "", type: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    // Валидация
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setMessage({ text: "Пароли не совпадают", type: "error" });
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      setMessage({ text: "Новый пароль должен содержать минимум 6 символов", type: "error" });
      return;
    }

    // Подготовка данных для отправки
    const updateData = {
      name: formData.name,
      email: formData.email
    };

    if (formData.newPassword) {
      updateData.currentPassword = formData.currentPassword;
      updateData.newPassword = formData.newPassword;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData)
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ text: data.message, type: "success" });
        setIsEditing(false);
        
        // Обновляем данные пользователя
        const profileRes = await fetch(`http://localhost:5000/api/profile/${userId}`);
        const profileData = await profileRes.json();
        setUser(profileData);
        
        // Обновляем имя в навбаре
        loadUser();
        
        // Очищаем поля паролей
        setFormData({
          ...formData,
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      } else {
        setMessage({ text: data.message, type: "error" });
      }
    } catch (error) {
      console.error("Update error:", error);
      setMessage({ text: "Ошибка при обновлении профиля", type: "error" });
    }
  };

  if (!user) {
    return (
      <div className="profile">
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
                <button onClick={logout} className="logout-btn">Выйти</button>
              </>
            ) : (
              <Link to="/"><button className="login-btn">Войти</button></Link>
            )}
          </div>
        </nav>
        <div style={{ textAlign: "center", padding: "50px" }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="profile">
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
              <button onClick={logout} className="logout-btn">Выйти</button>
            </>
          ) : (
            <Link to="/"><button className="login-btn">Войти</button></Link>
          )}
        </div>
      </nav>

      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>👤 Мой профиль</h1>
      </div>

      <div className="profile-card">
        {!isEditing ? (
          // Режим просмотра
          <>
            <div className="avatar">👤</div>
            <h2>{user.name}</h2>
            <p>📧 {user.email}</p>
            <p>🆔 ID: {user.id}</p>
            <p>📅 Зарегистрирован: {new Date(user.createdAt).toLocaleDateString()}</p>
            
            <button onClick={handleEditClick} className="edit-btn">
              ✏️ Редактировать профиль
            </button>
          </>
        ) : (
          // Режим редактирования
          <form onSubmit={handleSubmit} className="edit-form">
            <h3>Редактирование профиля</h3>
            
            {message.text && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}
            
            <div className="form-group">
              <label>Имя:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Текущий пароль (для смены пароля):</label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                placeholder="Введите текущий пароль"
              />
            </div>
            
            <div className="form-group">
              <label>Новый пароль:</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="Оставьте пустым, если не хотите менять"
              />
            </div>
            
            <div className="form-group">
              <label>Подтверждение пароля:</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Повторите новый пароль"
              />
            </div>
            
            <div className="form-buttons">
              <button type="submit" className="save-btn">
                💾 Сохранить
              </button>
              <button type="button" onClick={handleCancelClick} className="cancel-btn">
                ❌ Отмена
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;