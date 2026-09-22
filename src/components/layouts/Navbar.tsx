import { Link, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { LogOut, Calendar, LayoutDashboard } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { useCustomerDashboard } from '../../hooks/useCustomer';
import { useQueryClient } from '@tanstack/react-query';
import { logout as logoutApi } from '../../services/authService';

const NAV_LINKS = [
  { to: '/', label: 'Discover' },
  { to: '/categories', label: 'Categories' },
  { to: '/how-it-works', label: 'How it Works' },
];

const Navbar = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();
  const { data, isSuccess } = useCustomerDashboard();

  const cookieUser = (() => {
    try {
      const raw = Cookies.get('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const user = data?.data || data?.user || data || cookieUser;
  const hasToken = !!Cookies.get('accessToken');
  const isAuthenticated = Boolean((isSuccess && user) || (hasToken && (user || cookieUser)) || hasToken);

  const handleLogout = async () => {
    try {
      // Call backend logout endpoint
      await logoutApi();
    } catch (e) {
      console.error("Logout failed", e);
    }
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('user');
    queryClient.invalidateQueries({ queryKey: ['customerDashboard'] });
    navigate('/');
  };

  return (
    <div className="w-full px-4 pt-6 pb-2 max-w-[1440px] mx-auto">
      <nav className="w-full flex items-center justify-between py-4 px-8 bg-white rounded-full border border-slate-200">
        {/* Logo */}
      <div className="flex-shrink-0">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-blue tracking-tight">
          <Logo />
          Slottr
        </Link>
      </div>

      {/* Center Links */}
      <div className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
        {NAV_LINKS.map(({ to, label }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`relative transition-colors ${isActive ? 'text-blue' : 'hover:text-blue'}`}
            >
              {label}
              {isActive && (
                <span className="absolute -bottom-1.5 left-0 w-full h-0.5 bg-accent"></span>
              )}
            </Link>
          );
        })}
        <Link to="/provider-signup" className="hover:text-blue transition-colors">
          List your space
        </Link>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 sm:gap-6">
        {isAuthenticated ? (
          <div className="flex items-center gap-3 sm:gap-4">
            {/* View Bookings / Dashboard CTA Button */}
            <Link
              to={user?.role === 'PROVIDER' ? '/provider/bookings' : '/customer/bookings'}
              className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all inline-flex items-center gap-1.5 shadow-sm shadow-accent/20"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{user?.role === 'PROVIDER' ? 'Manage Bookings' : 'My Bookings'}</span>
            </Link>

            {user?.role === 'PROVIDER' && (
              <Link
                to="/provider/dashboard"
                className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
            )}

            <div className="flex items-center gap-2.5">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                alt="Profile" 
                className="w-9 h-9 rounded-full object-cover border border-slate-200"
              />
              <div className="hidden lg:flex flex-col">
                <span className="text-xs font-bold text-blue leading-tight">
                  {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : (user?.fullName || 'User')}
                </span>
                <span className="text-[11px] text-slate-500 leading-tight truncate max-w-[120px]">
                  {user?.email || 'user@example.com'}
                </span>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-red-600 transition-colors border border-slate-200 cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="text-sm font-semibold text-blue hover:text-slate-700 transition-colors">
              Log In
            </Link>
            <Link 
              to="/signup" 
              className="bg-button-dark text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-button-dark-hover transition-colors"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
      </nav>
    </div>
  );
};

export default Navbar;
