import { Link, useNavigate } from 'react-router-dom'
import './Authorization.css' // Создайте этот файл

const Authorization = () => {
    const navigate = useNavigate();

    const click = async () => {
        try {
            const emailValue = document.querySelector('#email').value;
            const passwordValue = document.querySelector('#password').value;
            
            if (!emailValue || !passwordValue) {
                const errMessage = document.querySelector('.auth_error');
                if (errMessage) {
                    errMessage.textContent = 'Заполните все поля';
                    errMessage.style.visibility = 'visible';
                }
                return;
            }
            
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: emailValue,
                    password: passwordValue
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                console.log('Успех:', data);
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem("userId", data.userId);
                navigate('/main');
            } else {
                console.error('Ошибка:', data.message);
                const errMessage = document.querySelector('.auth_error');
                if (errMessage) {
                    errMessage.textContent = data.message || 'Неверный логин или пароль';
                    errMessage.style.visibility = 'visible';
                }
            }
        } catch (error) {
            console.error('Ошибка запроса:', error);
            const errMessage = document.querySelector('.auth_error');
            if (errMessage) {
                errMessage.textContent = 'Ошибка соединения с сервером';
                errMessage.style.visibility = 'visible';
            }
        }
    }

    return (
        <div className='auth-app'>
            <div className="auth-container">
                <div className="auth-left">
                    <h1 className="auth-title">Phone Shop</h1>
                </div>
                
                <div className="auth-right">
                    <div className="auth-form-container">
                        <h2 className="auth-form-title">Welcome Back!</h2>
                        <p className="auth-subtitle">Please login to your account</p>
                        
                        <div className="auth-form">
                            <div className="input-group">
                                <label htmlFor="email" className="input-label">Email Address</label>
                                <input 
                                    id="email" 
                                    type="email" 
                                    className="auth-input" 
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="password" className="input-label">Password</label>
                                <input 
                                    id="password" 
                                    type="password" 
                                    className="auth-input"
                                    placeholder="Enter your password"
                                />
                            </div>

                            <button 
                                type="button"
                                className="login-btn"
                                onClick={click}
                            >
                                Log In
                            </button>
                        </div>
                        
                        <div className="auth_error">Неверный логин или пароль</div>
                        
                        <div className="auth-footer">
                            <p className="auth-footer-text">Don't have an account?</p>
                            <Link to="/registration" className="register-link">
                                Create Account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Authorization