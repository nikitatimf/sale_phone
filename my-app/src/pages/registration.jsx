import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react';
import './Registration.css' // Создайте этот файл

const Registration = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        digit: false,
        specialChar: false
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
        
        e.target.classList.remove('input_error');
        
        if (id === 'password') {
            validatePasswordStrength(value);
        }
    };

    const validatePasswordStrength = (password) => {
        setPasswordErrors({
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            digit: /[0-9]/.test(password),
            specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        });
    };

    const isPasswordStrong = () => {
        return Object.values(passwordErrors).every(Boolean);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setError('');
        setSuccess('');
        
        if (!formData.name.trim()) {
            setError('Введите имя');
            return;
        }
        
        if (formData.name.length < 2) {
            setError('Имя должно содержать минимум 2 символа');
            return;
        }
        
        if (!formData.email.trim()) {
            setError('Введите email');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Введите корректный email (например: user@example.com)');
            return;
        }
        
        if (!formData.password) {
            setError('Введите пароль');
            return;
        }
        
        if (!isPasswordStrong()) {
            setError('Пароль не соответствует требованиям безопасности');
            return;
        }
        
        if (formData.password !== formData.confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    password: formData.password
                })
            });

            const data = await response.json();
            
            if (response.status === 200 && data.success === true) {
                setSuccess(data.message || 'Регистрация прошла успешно!');
                localStorage.setItem("userId", data.userId);
                
                setFormData({ 
                    name: '', 
                    email: '', 
                    password: '',
                    confirmPassword: '' 
                });
                
                setPasswordErrors({
                    length: false,
                    uppercase: false,
                    lowercase: false,
                    digit: false,
                    specialChar: false
                });
                
                setTimeout(() => {
                    navigate('/main');
                }, 2000);
            } else {
                const errorMessage = data.message || 'Ошибка при регистрации';
                setError(errorMessage);
            }
            
        } catch (error) {
            console.error('Ошибка:', error);
            setError('Не удалось подключиться к серверу. Убедитесь, что сервер запущен.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='reg-app'>
            <div className="reg-container">
                <div className="reg-left">
                    <h1 className="reg-title">Phone Shop</h1>
                    
                </div>
                
                <div className="reg-right">
                    <div className="reg-form-container">
                        <h2 className="reg-form-title">Create Account</h2>
                        <p className="reg-subtitle">Sign up to get started</p>
                        
                        {error && (
                            <div className='reg-error'>
                                {error}
                            </div>
                        )}
                        
                        {success && (
                            <div className='reg-success'>
                                {success}
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit} className="reg-form">
                            <div className="input-group">
                                <label htmlFor="name" className="input-label">Full Name</label>
                                <input 
                                    id="name" 
                                    type="text" 
                                    className="reg-input" 
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="email" className="input-label">Email Address</label>
                                <input 
                                    id="email" 
                                    type="email" 
                                    className="reg-input" 
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="password" className="input-label">Password</label>
                                <input 
                                    id="password" 
                                    type="password" 
                                    className="reg-input"
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                            
                            {/* Индикатор сложности пароля */}
                            {formData.password && (
                                <div className="reg-password-strength">
                                    <div className="strength-title">Password requirements:</div>
                                    <div className="strength-requirements">
                                        <div className={`requirement ${passwordErrors.length ? 'valid' : 'invalid'}`}>
                                            {passwordErrors.length ? '✓' : '○'} Minimum 8 characters
                                        </div>
                                        <div className={`requirement ${passwordErrors.uppercase ? 'valid' : 'invalid'}`}>
                                            {passwordErrors.uppercase ? '✓' : '○'} Uppercase letter (A-Z)
                                        </div>
                                        <div className={`requirement ${passwordErrors.lowercase ? 'valid' : 'invalid'}`}>
                                            {passwordErrors.lowercase ? '✓' : '○'} Lowercase letter (a-z)
                                        </div>
                                        <div className={`requirement ${passwordErrors.digit ? 'valid' : 'invalid'}`}>
                                            {passwordErrors.digit ? '✓' : '○'} Digit (0-9)
                                        </div>
                                        <div className={`requirement ${passwordErrors.specialChar ? 'valid' : 'invalid'}`}>
                                            {passwordErrors.specialChar ? '✓' : '○'} Special character (!@#$%^&*)
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="input-group">
                                <label htmlFor="confirmPassword" className="input-label">Confirm Password</label>
                                <input 
                                    id="confirmPassword" 
                                    type="password" 
                                    className="reg-input"
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                            
                            {/* Проверка совпадения паролей */}
                            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                <div className="password-mismatch">
                                    ⚠️ Passwords do not match
                                </div>
                            )}

                            <button 
                                type="submit"
                                className="reg-btn"
                                disabled={isLoading || (formData.password && !isPasswordStrong())}
                            >
                                {isLoading ? 'Creating account...' : 'Sign Up'}
                            </button>
                        </form>
                        
                        <div className="reg-footer">
                            <p className="reg-footer-text">Already have an account?</p>
                            <Link to="/" className="login-link">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Registration