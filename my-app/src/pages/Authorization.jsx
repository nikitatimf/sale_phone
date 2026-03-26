import Registration from './registration'
import { Router, Route, Link, Routes } from 'react-router-dom'

const Authorization = () => {
    return (
        <div className='app'>
            <div className="container container-authorization">
                Phone shop
                <img className='app_authorization_photo' src="src/img/authorization.png"/>
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
                    <button className='authorization_button'>Log in</button>
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