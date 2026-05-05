import { Link, useNavigate } from 'react-router-dom'

const Authorization = () => {
    const navigate = useNavigate();

    const click = async () => {
        try {
            const emailValue = document.querySelector('#email').value;
            const passwordValue = document.querySelector('#password').value;
            
            // Добавьте проверку на пустые поля
            if (!emailValue || !passwordValue) {
                const errMessage = document.querySelector('.auth_error');
                if (errMessage) {
                    errMessage.textContent = 'Заполните все поля';
                    errMessage.style.visibility = 'visible';
                }
                return; // Выходим из функции, если поля пустые
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
            console.log(response)
            
            if (response.ok) {
                console.log('Успех:', data);
                // Сохраняем токен
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem("userId", data.userId);
                
                navigate('/Main'); // Переход только при успешном входе
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
        <div className='app'>
            <div className="container container-authorization">
                Phone shop
                <img className='app_authorization_photo' src="my-app/src/img/authorization.png" alt="authorization"/>
                <div className='authorization_area'>
                    Log in
                    <div className='form_auth'>
                        <label htmlFor="email" className='authorization_area_label'></label>
                        <input 
                            id="email" 
                            type="email" 
                            className='authorization_input' 
                            placeholder='Email'
                        />

                        <label htmlFor="password" className='authorization_area_label'></label>
                        <input 
                            id="password" 
                            type="password" 
                            className='authorization_input'
                            placeholder='Password'
                        />

                        <button 
                            type="button"
                            className='link_authorization authorization_button'
                            onClick={click}
                        >
                            Log in
                        </button>
                    </div>
                    
                    <div className='auth_error'>Неверный логин или пароль</div>
                    <Link to="/registration" className='link_authorization authorization_button authorization_button-registration'>
                        Registration
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Authorization