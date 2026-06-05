import { Navigate, Route, Routes } from 'react-router-dom'
import AuthPage from './pages/auth.jsx'
import HomePage from './pages/homepage.jsx'
import Navbar from './components/layouts/navbar.jsx'
import { useAuthStore } from './store/authStore.js'
import AuctionPage from './pages/auctionPage'
import SellerPage from './pages/sellerPage'
import BuyerPage from './pages/buyerPage'

function App() {
  const { authUser } = useAuthStore()
  return (
    <div className="min-h-screen ">
      <Navbar />
      <Routes>
        <Route path='/' element={!authUser ? <HomePage /> : (authUser?.role === "Buyer" ? <Navigate to='/buyer' /> : <Navigate to='/seller' />)} />
        <Route path='/auth' element={!authUser ? <AuthPage /> : <Navigate to={authUser.role === "Buyer" ? '/buyer' : '/seller'} />} />
        <Route path='/buyer' element={authUser && authUser?.role === "Buyer" ? <BuyerPage /> : <Navigate to='/' />} />
        <Route path='/auction/:id' element={authUser ? <AuctionPage /> : <Navigate to='/' />} />
        <Route path='/seller' element={authUser && authUser?.role === 'Seller' ? <SellerPage /> : <Navigate to='/' />} />
      </Routes>
    </div>
  )
}

export default App
