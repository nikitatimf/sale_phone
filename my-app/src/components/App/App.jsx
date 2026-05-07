import { Route, Routes, Navigate } from 'react-router-dom'

import Authorization from '../../pages/Authorization'
import Registration from '../../pages/registration'
import Mainp from '../../pages/Main/Main'
import Favorites from '../../pages/Favorites/Favorites'
import Cart from '../../pages/Cart/Cart'
import Profile from '../../pages/Profile/Profile'
import Product from '../../pages/Product/Product'
import Orders from '../../pages/Orders/Orders'

import ProtectedRoute from '../../ProtectedRoute'

const PublicRoute = ({ children }) => {
  const userId = localStorage.getItem("userId");

  return userId ? <Navigate to="/Main" /> : children;
};

const App = () => {
  return (
    <Routes>

      {/* 🔓 public */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <Authorization />
          </PublicRoute>
        }
      />

      <Route
        path="/registration"
        element={
          <PublicRoute>
            <Registration />
          </PublicRoute>
        }
      />

      {/* 🔒 protected */}
      <Route
        path="/Main"
        element={
          <ProtectedRoute>
            <Mainp />
          </ProtectedRoute>
        }
      />

      <Route
        path="/Favorites"
        element={
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        }
      />

      <Route
        path="/Cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/product/:id"
        element={
          <ProtectedRoute>
            <Product />
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />

    </Routes>
  )
}

export default App