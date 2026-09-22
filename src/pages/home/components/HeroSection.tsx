import SearchBar from './SearchBar';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { useCustomerDashboard } from '../../../hooks/useCustomer';

const HeroSection = () => {
  const { data } = useCustomerDashboard();
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
  const isAuthenticated = Boolean(hasToken || user);
  const firstName = user?.firstName || (user?.fullName ? user.fullName.split(' ')[0] : null) || 'there';

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 mt-8">
      {/* Container with background image and overlay */}
      <div 
        className="rounded-3xl py-20 px-4 sm:px-8 text-center border border-slate-200 relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=1600&h=600')" }}
      >
        <div className="absolute inset-0 bg-white/55 backdrop-blur-md"></div>
        <div className="relative z-10 flex flex-col items-center">
          
          {/* Authenticated CTA Ribbon */}
          {isAuthenticated && (
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-white/90 backdrop-blur-sm px-4 sm:px-5 py-2 rounded-full border border-slate-200 shadow-sm mb-6 text-xs sm:text-sm text-slate-700 animate-fadeIn">
              <span className="flex items-center gap-1.5 font-semibold text-blue">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                Welcome back, {firstName}!
              </span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <Link
                to={user?.role === 'PROVIDER' ? '/provider/bookings' : '/customer/bookings'}
                className="font-bold text-accent hover:text-accent/80 inline-flex items-center gap-1 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{user?.role === 'PROVIDER' ? 'Manage provider bookings' : 'View your bookings'}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue tracking-tight leading-tight max-w-4xl mx-auto mb-16">
            Book anything, anywhere. From spaces to services.
          </h1>
          
          <SearchBar />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
