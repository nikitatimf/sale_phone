
import { Router, Route, Link, Routes } from 'react-router-dom'


const validLight = () => {
    const form = document.querySelector('form');
    const requir = Array.from(form.querySelectorAll('[required]'));
    let allValid = true;
    requir.forEach(input => {
        const isEmpty = input.value.trim() === '';
        if (isEmpty) {
            allValid = false;
            input.classList.add('input_error');
        }
        else {
            input.classList.remove('input_error');
        }
    })
    return allValid;
}

const click = async (e) => {
    try {
        const isValid = validLight();
        if (!isValid) {
            e.preventDefault();
            return;
        }

        const nameValue = document.querySelector('#name').value;
        const emailValue = document.querySelector('#email').value;
        const passwordValue = document.querySelector('#password').value;
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: nameValue,
                email: emailValue,
                password: passwordValue
            })
        })

        const data = await response.json();
        console.log(data.message)
    } catch {
        console.log('error')
    }
}

const Registration = () => {
    return (
        <div className='app'>
            <div className="container container-authorization">
                Phone shop
                <img className='app_authorization_photo' src="my-app/src/img/authorization.png"/>
                <div className='authorization_area'>
                    Registration
                    <form 
                        action="register"
                        className='form_auth'
                    >
                        <label 
                            htmlFor="name" 
                            className='authorization_area_label' 
                        />
                        <input 
                            id="name" 
                            type="text" 
                            className='authorization_input' 
                            placeholder='Name'
                            required
                        />

                        <label 
                            htmlFor="email" 
                            className='authorization_area_label'
                        />
                        <input 
                            id="email" 
                            type="email" 
                            className='authorization_input' 
                            placeholder='Email'
                            required
                        />

                        <label 
                            htmlFor="password" 
                            className='authorization_area_label' 
                        />
                        <input 
                            id="password" 
                            type="password" 
                            className='authorization_input'
                            placeholder='Password'
                            required
                        />

                        <button 
                            className='authorization_button'
                            onClick={click}
                            type='button'
                        >
                            Registration
                        </button>
                    </form>
                    {/* <Link to="/registration" className='link_authorization authorization_button authorization_button-registration'>
                        Registration
                    </Link> */}

                </div>
            </div>

            {/* <Routes>
                <Route path='/registration' element={<Registration />}></Route>        
            </Routes> */}
        </ div>
    )
}

export default Registration