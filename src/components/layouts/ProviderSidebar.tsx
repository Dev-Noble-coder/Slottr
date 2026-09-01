import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
    Home, 
    List, 
    Users, 
    Calendar, 
    CheckSquare, 
    FileEdit, 
    Hexagon,
    LogOut
} from 'lucide-react';
import Cookies from 'js-cookie';
import { logout as logoutApi } from '../../services/authService';
import { Logo } from '../ui/Logo';

interface ProviderSidebarProps {
    mobileOpen: boolean;
    setMobileOpen: (open: boolean) => void;
}

const ProviderSidebar = ({ mobileOpen, setMobileOpen }: ProviderSidebarProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    const navItems = [
        { name: 'Dashboard', path: '/provider/dashboard', icon: Home },
        { name: 'Listings', path: '/provider/listings', icon: List },
        { name: 'Users', path: '/provider/users', icon: Users },
        { name: 'Bookings', path: '/provider/bookings', icon: Calendar },
        { name: 'Payments', path: '/provider/payments', icon: CheckSquare },
        { name: 'Audit', path: '/provider/audit', icon: FileEdit },
        { name: 'Settings', path: '/provider/settings', icon: Hexagon },
    ];

    const handleLogout = async () => {
        try {
            await logoutApi();
        } catch (e) {
            console.error("Logout failed", e);
        }
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        navigate('/provider-login');
    };

    // desktop state
    const isExpanded = isHovered;
    const sidebarWidth = isExpanded ? 'lg:w-[260px]' : 'lg:w-[80px]';

    return (
        <>
            {/* Mobile Overlay */}
            {mobileOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <aside 
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`fixed lg:sticky top-0 lg:top-4 left-0 lg:ml-4 lg:mt-4 lg:mb-4 z-50 h-screen lg:h-[calc(100vh-32px)] rounded-none lg:rounded-2xl bg-[#1A2234] text-white flex flex-col transition-all duration-300 ease-in-out w-[260px] lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} ${sidebarWidth} overflow-hidden shadow-xl shrink-0`}
            >
                {/* Logo Area */}
                <div className="h-24 flex items-center px-5 shrink-0 pt-4">
                    <div className="flex items-center gap-3 w-[212px]">
                        {/* Custom SVG logo from the screenshot */}
                        <div className="shrink-0 flex items-center justify-center text-white">
                           <Logo className="w-10 h-8" />
                        </div>
                        <span className={`text-2xl font-semibold tracking-tight transition-opacity duration-300 ${isExpanded || mobileOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
                            Slottr.
                        </span>
                    </div>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 py-4 flex flex-col gap-2 relative overflow-y-auto overflow-x-hidden scrollbar-hide">
                    {navItems.map((item) => {
                        const isActive = location.pathname.includes(item.path);
                        const Icon = item.icon;
                        return (
                            <Link 
                                key={item.name}
                                to={item.path}
                                onClick={() => setMobileOpen(false)}
                                className="relative flex items-center h-12 group mx-3"
                            >
                                {/* Active Indicator Arc */}
                                {isActive && (
                                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 z-10">
                                        <svg width="12" height="24" viewBox="0 0 12 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cy="12" r="12" fill="url(#paint0_radial_107_255)"/>
                                            <defs>
                                                <radialGradient id="paint0_radial_107_255" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(0 12) rotate(90) scale(12)">
                                                    <stop stopColor="white"/>
                                                    <stop offset="1" stopColor="#188AF9"/>
                                                </radialGradient>
                                            </defs>
                                        </svg>
                                    </div>
                                )}

                                <div className={`flex items-center gap-4 px-3 w-[212px] h-full rounded-xl transition-all duration-200 ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                                    <div className="shrink-0 w-8 h-8 flex items-center justify-center">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <span className={`text-[15px] font-medium whitespace-nowrap transition-opacity duration-300 ${isExpanded || mobileOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
                                        {item.name}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Section */}
                <div className="shrink-0 pb-6 pt-4 flex flex-col gap-2">
                    {/* User Profile */}
                    <div className="flex items-center h-14 px-5">
                        <div className="flex items-center gap-3 w-[212px]">
                            <div className="shrink-0 w-10 h-10 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-sm">
                                2S
                            </div>
                            <div className={`flex flex-col whitespace-nowrap transition-opacity duration-300 ${isExpanded || mobileOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
                                <span className="text-sm font-semibold text-white">2pacshakur</span>
                                <span className="text-xs text-slate-400">Superadmin</span>
                            </div>
                        </div>
                    </div>

                    {/* Logout */}
                    <button 
                        onClick={handleLogout}
                        className="flex items-center h-12 group mx-3 text-left w-full"
                    >
                        <div className="flex items-center gap-4 px-3 w-[212px] h-full transition-all duration-200 text-slate-300 hover:text-white">
                            <div className="shrink-0 w-8 h-8 flex items-center justify-center">
                                <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-500 transition-colors" />
                            </div>
                            <span className={`text-[15px] font-medium whitespace-nowrap transition-opacity duration-300 ${isExpanded || mobileOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
                                Logout
                            </span>
                        </div>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default ProviderSidebar;
