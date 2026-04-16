import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react';

const Registration = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
        // Убираем класс ошибки при вводе
        e.target.classList.remove('input_error');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setError('');
        setSuccess('');
        
        // Валидация
        if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
            setError('Заполните все поля');
            return;
        }
        
        // Валидация email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Введите корректный email');
            return;
        }
        
        // Валидация пароля (минимум 6 символов)
        if (formData.password.length < 6) {
            setError('Пароль должен содержать минимум 6 символов');
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
                
                // Очищаем форму
                setFormData({ name: '', email: '', password: '' });
                
                // Перенаправляем на страницу авторизации через 2 секунды
                setTimeout(() => {
                    navigate('/Maina');
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
                            placeholder='Name'
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
                            placeholder='Password (min 6 characters)'
                            value={formData.password}
                            onChange={handleChange}
                            disabled={isLoading}
                            required
                        />

                        <button 
                            type="submit"
                            className='link_authorization authorization_button'
                            disabled={isLoading}
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