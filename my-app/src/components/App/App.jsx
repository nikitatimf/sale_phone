import { Router, Route, Link, Routes, Navigate } from 'react-router-dom'

import Authorization from '../../pages/Authorization'
import Registration from '../../pages/registration'
import Mainp from '../../pages/Main/Main'
import Favorites from '../../pages/Favorites/Favorites'


const PublicRoute = ({ children }) => {
  const isAuth = localStorage.getItem("token");

  return isAuth ? <Navigate to="/Main" /> : children;
};


const App = () => {
    return (
        <Routes>
            <Route
                path='/' 
                element={
                    <PublicRoute>
                        <Authorization />
                    </PublicRoute>
                }
            />
            <Route 
                path='/registration' 
                element={
                    <PublicRoute>
                        <Registration />
                    </PublicRoute>
                    
                }
            />
            <Route path='/Main' element={<Mainp />} />   
            <Route path='/Favorites' element={<Favorites />} />
        </Routes>
    )
}

export default App