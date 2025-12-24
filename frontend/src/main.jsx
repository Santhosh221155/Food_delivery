import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Toaster } from 'react-hot-toast'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import Restaurant from './pages/Restaurant.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import Orders from './pages/Orders.jsx'
import OrderDetails from './pages/OrderDetails.jsx'
import Profile from './pages/Profile.jsx'
import Auth from './pages/Auth.jsx'
import Signup from './pages/Signup.jsx'
import { useUserStore } from './store/user.js'

function RequireAuth({ children }) {
  const user = useUserStore(s=> s.user)
  if (!user) return <Navigate to="/signup" replace />
  return children
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'restaurant/:id', element: <Restaurant /> },
      { path: 'cart', element: <Cart /> },
      { path: 'checkout', element: <RequireAuth><Checkout /></RequireAuth> },
      { path: 'orders', element: <RequireAuth><Orders /></RequireAuth> },
      { path: 'orders/:id', element: <RequireAuth><OrderDetails /></RequireAuth> },
      { path: 'profile', element: <RequireAuth><Profile /></RequireAuth> },
      { path: 'auth', element: <Auth /> },
      { path: 'signup', element: <Signup /> }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster position="top-center" />
  </StrictMode>,
)
