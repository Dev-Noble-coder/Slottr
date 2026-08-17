import { Link } from 'react-router-dom';

import { Logo } from '../ui/Logo';

const Navbar = () => {
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
        <Link to="/" className="text-blue relative">
          Discover
          <span className="absolute -bottom-1.5 left-0 w-full h-[2px] bg-accent"></span>
        </Link>
        <Link to="/categories" className="hover:text-blue transition-colors">
          Categories
        </Link>
        <Link to="/how-it-works" className="hover:text-blue transition-colors">
          How it Works
        </Link>
        <Link to="/list-space" className="hover:text-blue transition-colors">
          List your space
        </Link>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        <Link to="/login" className="text-sm font-semibold text-blue hover:text-slate-700 transition-colors">
          Log In
        </Link>
        <Link 
          to="/signup" 
          className="bg-button-dark text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-button-dark-hover transition-colors"
        >
          Sign Up
        </Link>
      </div>
      </nav>
    </div>
  );
};

export default Navbar;
