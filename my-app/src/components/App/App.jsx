import { Router, Route, Link, Routes, Navigate } from 'react-router-dom'

import Authorization from '../../pages/Authorization'
import Registration from '../../pages/registration'
import Mainp from '../../pages/Main/Main'
import Favorites from '../../pages/Favorites/Favorites'
import Cart from '../../pages/Cart/Cart'
import Profile from '../../pages/Profile/Profile'
import Product from '../../pages/Product/Product'
import Orders from '../../pages/Orders/Orders'


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
            <Route path='/Cart' element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/orders" element={<Orders />} />
        </Routes>
    )
}

export default App