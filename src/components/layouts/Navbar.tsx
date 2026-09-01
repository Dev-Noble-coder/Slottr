import { Link, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { LogOut } from 'lucide-react';
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

  const user = data?.data || data?.user || data;
  const isAuthenticated = isSuccess && !!user;

  const handleLogout = async () => {
    try {
      // Call backend logout endpoint
      await logoutApi();
    } catch (e) {
      console.error("Logout failed", e);
    }
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
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
      <div className="flex items-center gap-6">
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover border border-slate-200"
              />
              <div className="hidden md:flex flex-col">
                <span className="text-sm font-bold text-blue leading-tight">
                  {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Demo User'}
                </span>
                <span className="text-xs text-slate-500 leading-tight">
                  {user?.email || 'demo@example.com'}
                </span>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
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
