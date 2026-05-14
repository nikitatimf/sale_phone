import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react';

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
        
        // Убираем класс ошибки при вводе
        e.target.classList.remove('input_error');
        
        // Если меняется поле password, проверяем его сложность
        if (id === 'password') {
            validatePasswordStrength(value);
        }
    };

    // Функция проверки сложности пароля
    const validatePasswordStrength = (password) => {
        setPasswordErrors({
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            digit: /[0-9]/.test(password),
            specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        });
    };

    // Проверка, что все требования к паролю выполнены
    const isPasswordStrong = () => {
        return Object.values(passwordErrors).every(Boolean);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setError('');
        setSuccess('');
        
        // Валидация имени
        if (!formData.name.trim()) {
            setError('Введите имя');
            return;
        }
        
        if (formData.name.length < 2) {
            setError('Имя должно содержать минимум 2 символа');
            return;
        }
        
        // Валидация email
        if (!formData.email.trim()) {
            setError('Введите email');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Введите корректный email (например: user@example.com)');
            return;
        }
        
        // Валидация пароля
        if (!formData.password) {
            setError('Введите пароль');
            return;
        }
        
        // Проверка сложности пароля
        if (!isPasswordStrong()) {
            setError('Пароль не соответствует требованиям безопасности');
            return;
        }
        
        // Проверка совпадения паролей
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
            console.log('Статус:', response.status);
            console.log('Ответ:', data);
            
            if (response.status === 200 && data.success === true) {
                setSuccess(data.message || 'Регистрация прошла успешно!');
                localStorage.setItem("userId", data.userId);
                
                // Очищаем форму
                setFormData({ 
                    name: '', 
                    email: '', 
                    password: '',
                    confirmPassword: '' 
                });
                
                // Сбрасываем ошибки пароля
                setPasswordErrors({
                    length: false,
                    uppercase: false,
                    lowercase: false,
                    digit: false,
                    specialChar: false
                });
                
                // Перенаправляем на главную страницу через 2 секунды
                setTimeout(() => {
                    navigate('/Main');
                }, 2000);
            } else {
                // Обработка ошибок от сервера
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
        <div className='app'>
            <div className="container container-authorization">
                Phone shop
                <img className='app_authorization_photo' src="my-app/src/img/authorization.png" alt="registration"/>
                <div className='registration_area'>
                    <h2>Registration</h2>
                    
                    {error && (
                        <div className='auth_error' style={{ visibility: 'visible', color: 'red', marginBottom: '10px' }}>
                            {error}
                        </div>
                    )}
                    
                    {success && (
                        <div className='success_message' style={{ visibility: 'visible', color: 'green', marginBottom: '10px' }}>
                            {success}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className='form_register'>
                        <input 
                            id="name" 
                            type="text" 
                            className='register_input' 
                            placeholder='Name (минимум 2 символа)'
                            value={formData.name}
                            onChange={handleChange}
                            disabled={isLoading}
                            required
                        />

                        <input 
                            id="email" 
                            type="email" 
                            className='register_input' 
                            placeholder='Email'
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isLoading}
                            required
                        />

                        <input 
                            id="password" 
                            type="password" 
                            className='register_input'
                            placeholder='Password'
                            value={formData.password}
                            onChange={handleChange}
                            disabled={isLoading}
                            required
                        />
                        
                        {/* Индикатор сложности пароля */}
                        {formData.password && (
                            <div className="password-strength">
                                <div className="password-requirements">
                                    <p style={{ 
                                        color: passwordErrors.length ? 'green' : 'red',
                                        fontSize: '12px',
                                        margin: '2px 0'
                                    }}>
                                        ✓ Минимум 8 символов
                                    </p>
                                    <p style={{ 
                                        color: passwordErrors.uppercase ? 'green' : 'red',
                                        fontSize: '12px',
                                        margin: '2px 0'
                                    }}>
                                        ✓ Заглавная буква (A-Z)
                                    </p>
                                    <p style={{ 
                                        color: passwordErrors.lowercase ? 'green' : 'red',
                                        fontSize: '12px',
                                        margin: '2px 0'
                                    }}>
                                        ✓ Строчная буква (a-z)
                                    </p>
                                    <p style={{ 
                                        color: passwordErrors.digit ? 'green' : 'red',
                                        fontSize: '12px',
                                        margin: '2px 0'
                                    }}>
                                        ✓ Цифра (0-9)
                                    </p>
                                    <p style={{ 
                                        color: passwordErrors.specialChar ? 'green' : 'red',
                                        fontSize: '12px',
                                        margin: '2px 0'
                                    }}>
                                        ✓ Специальный символ (!@#$%^&*)
                                    </p>
                                </div>
                            </div>
                        )}

                        <input 
                            id="confirmPassword" 
                            type="password" 
                            className='register_input'
                            placeholder='Подтвердите пароль'
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            disabled={isLoading}
                            required
                        />
                        
                        {/* Проверка совпадения паролей */}
                        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                            <div style={{ color: 'red', fontSize: '12px', marginTop: '-10px', marginBottom: '10px' }}>
                                ⚠️ Пароли не совпадают
                            </div>
                        )}

                        <button 
                            type="submit"
                            className='link_authorization authorization_button'
                            disabled={isLoading || (formData.password && !isPasswordStrong())}
                        >
                            {isLoading ? 'Регистрация...' : 'Registration'}
                        </button>
                    </form>
                    
                    <Link to="/authorization" className='link_authorization authorization_button authorization_button-registration'>
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Registration