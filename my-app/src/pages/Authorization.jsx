import Registration from './registration'
import { Router, Route, Link, Routes } from 'react-router-dom'

const click = async () => {
    try {
        const emailValue = document.querySelector('#email').value;
        const passwordValue = document.querySelector('#password').value;
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
            // Сохраняем токен
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        } else {
            console.error('Ошибка:', data.message);
        }
    } catch (error) {
        console.error('Ошибка запроса:', error);
  }
}

const Authorization = () => {
    return (
        <div className='app'>
            <div className="container container-authorization">
                Phone shop
                <img className='app_authorization_photo' src="my-app/src/img/authorization.png"/>
                <div className='authorization_area'>
                    Log in
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
                    <button className='authorization_button' onClick={click}>Log in</button>
                    <Link to="/registration" className='link_authorization authorization_button authorization_button-registration'>
                        Registration
                    </Link>

                </div>
            </div>

            <Routes>
                <Route path='/registration' element={<Registration />}></Route>        
            </Routes>
        </ div>
    )
}

export default Authorization