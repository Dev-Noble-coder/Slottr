import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'

import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ProviderLogin from './pages/auth/ProviderLogin'
import ProviderSignup from './pages/auth/ProviderSignup'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import AcceptInvitation from './pages/admin/auth/AcceptInvitation'
import AdminLogin from './pages/admin/auth/AdminLogin'

import LandingPage from './pages/home/LandingPage'
import ListingDetailsPage from './pages/listing/ListingDetailsPage'
import CategoriesPage from './pages/categories/CategoriesPage'
import HowItWorksPage from './pages/how-it-works/HowItWorksPage'
import Dashboard from './pages/provider/Dashboard'
import Listings from './pages/provider/Listings'
import Profile from './pages/provider/Profile'
import Settings from './pages/provider/Settings'
import Bookings from './pages/provider/Bookings'

const App = () => {
  return (
    <>
    <Toaster />
    <Router>
      <Routes>
        {/* Shared Auth Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/listing/:id" element={<ListingDetailsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/provider-login" element={<ProviderLogin />} />
        <Route path="/provider-signup" element={<ProviderSignup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Admin Specific Pages */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/accept-invitation/activate" element={<AcceptInvitation />} />

        {/* Provider Specific Pages */}
        <Route path="/provider/dashboard" element={<Dashboard />} />
        <Route path="/provider/listings" element={<Listings />} />
        <Route path="/provider/profile" element={<Profile />} />
        <Route path="/provider/settings" element={<Settings />} />
        <Route path="/provider/bookings" element={<Bookings />} />
      </Routes>
    </Router>
    </>
  )
}
 
export default App  