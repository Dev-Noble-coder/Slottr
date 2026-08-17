import { Link } from 'react-router-dom';

import { Logo } from '../ui/Logo';

const Footer = () => {
  return (
    <footer className="w-full bg-blue text-slate-400 py-12 px-8 mt-24">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Left side */}
        <div className="mb-6 md:mb-0 flex flex-col items-center md:items-start">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-white tracking-tight mb-2">
            <Logo className="w-10 h-8 text-white" />
            Slottr
          </Link>
          <p className="text-sm text-slate-400">
            © 2024 Universal Booking Platform. All rights reserved.
          </p>
        </div>

        {/* Right side links */}
        <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
          <Link to="/platform" className="hover:text-white transition-colors">Platform</Link>
          <Link to="/support" className="hover:text-white transition-colors">Support</Link>
          <Link to="/vendor" className="hover:text-white transition-colors">Vendor Resources</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
