
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

const App = () => {
  return (
    <>
    <Toaster />
    <Router>
      <Routes>
        {/* Shared Auth Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/listing/:id" element={<ListingDetailsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/provider-login" element={<ProviderLogin />} />
        <Route path="/provider-signup" element={<ProviderSignup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Admin Specific Pages */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/accept-invitation/activate" element={<AcceptInvitation />} />
      </Routes>
    </Router>
    </>
  )
}
 
export default App  