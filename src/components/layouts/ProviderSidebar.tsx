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
    User,
    LogOut
} from 'lucide-react';
import Cookies from 'js-cookie';
import { logout as logoutApi } from '../../services/authService';
import { useProviderHome } from '../../hooks/useProvider';
import { Logo } from '../ui/Logo';

interface ProviderSidebarProps {
    mobileOpen: boolean;
    setMobileOpen: (open: boolean) => void;
}

const ProviderSidebar = ({ mobileOpen, setMobileOpen }: ProviderSidebarProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const { data: homeData } = useProviderHome();

    const provider = homeData?.provider;
    const displayName = provider?.fullName || provider?.username || 'Provider';
    const displayInitials = provider?.fullName
        ? provider.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
        : (provider?.username ? provider.username.slice(0, 2).toUpperCase() : 'P');

    const navItems = [
        { name: 'Dashboard', path: '/provider/dashboard', icon: Home },
        { name: 'Listings', path: '/provider/listings', icon: List },
        { name: 'Bookings', path: '/provider/bookings', icon: Calendar },
        { name: 'Profile', path: '/provider/profile', icon: User },
        { name: 'Users', path: '/provider/users', icon: Users },
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
                className={`fixed lg:sticky top-0 lg:top-4 left-0 lg:ml-4 lg:mt-4 lg:mb-4 z-50 h-screen lg:h-[calc(100vh-32px)] rounded-none lg:rounded-md bg-[#1A2234] border border-slate-800 text-white flex flex-col transition-all duration-300 ease-in-out w-[260px] lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} ${sidebarWidth} overflow-hidden shrink-0`}
            >
                {/* Logo Area */}
                <div className="h-20 flex items-center px-5 shrink-0 pt-2">
                    <div className="flex items-center gap-3 w-[212px]">
                        <div className="shrink-0 flex items-center justify-center text-white">
                           <Logo className="w-9 h-7" />
                        </div>
                        <span className={`text-xl font-bold tracking-tight transition-opacity duration-300 ${isExpanded || mobileOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
                            Slottr.
                        </span>
                    </div>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 py-3 flex flex-col gap-1.5 relative overflow-y-auto overflow-x-hidden scrollbar-hide">
                    {navItems.map((item) => {
                        const isActive = location.pathname.includes(item.path);
                        const Icon = item.icon;
                        return (
                            <Link 
                                key={item.name}
                                to={item.path}
                                onClick={() => setMobileOpen(false)}
                                className="relative flex items-center h-11 group mx-2.5"
                            >
                                {/* Active Indicator Bar */}
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent rounded-r-sm z-10" />
                                )}

                                <div className={`flex items-center gap-3 px-3 w-[212px] h-full rounded-md transition-all duration-150 ${isActive ? 'bg-slate-800/80 text-white font-semibold' : 'text-slate-400 hover:text-white hover:bg-slate-850'}`}>
                                    <div className="shrink-0 w-6 h-6 flex items-center justify-center">
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <span className={`text-sm font-medium whitespace-nowrap transition-opacity duration-300 ${isExpanded || mobileOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
                                        {item.name}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Section */}
                <div className="shrink-0 pb-4 pt-2 flex flex-col gap-1 border-t border-slate-800/60">
                    {/* User Profile */}
                    <Link 
                        to="/provider/profile"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center h-14 px-4 mx-2 rounded-md hover:bg-slate-800/60 transition-colors"
                    >
                        <div className="flex items-center gap-3 w-[212px]">
                            {provider?.avatarUrl ? (
                                <img 
                                    src={provider.avatarUrl} 
                                    alt={displayName} 
                                    className="shrink-0 w-8 h-8 rounded-md object-cover border border-slate-700" 
                                />
                            ) : (
                                <div className="shrink-0 w-8 h-8 rounded-md bg-blue/30 text-white border border-blue/40 flex items-center justify-center font-bold text-xs">
                                    {displayInitials}
                                </div>
                            )}
                            <div className={`flex flex-col whitespace-nowrap overflow-hidden transition-opacity duration-300 ${isExpanded || mobileOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
                                <span className="text-xs font-semibold text-white truncate max-w-[140px]">{displayName}</span>
                                <span className="text-[10px] text-slate-400 capitalize">{provider?.role?.toLowerCase() || 'Provider'}</span>
                            </div>
                        </div>
                    </Link>

                    {/* Logout */}
                    <button 
                        onClick={handleLogout}
                        className="flex items-center h-10 mx-2 px-4 rounded-md text-left text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
                    >
                        <div className="flex items-center gap-3 w-[212px]">
                            <div className="shrink-0 w-8 h-8 flex items-center justify-center">
                                <LogOut className="w-4 h-4 text-red-400" />
                            </div>
                            <span className={`text-xs font-medium whitespace-nowrap transition-opacity duration-300 ${isExpanded || mobileOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
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
