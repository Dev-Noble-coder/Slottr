import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, List, Settings, LogOut, Menu, User } from 'lucide-react';

interface ProviderLayoutProps {
    children: ReactNode;
}

const ProviderLayout = ({ children }: ProviderLayoutProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { name: 'Dashboard', path: '/provider/dashboard', icon: LayoutDashboard },
        { name: 'My Listings', path: '/provider/listings', icon: List },
        { name: 'Settings', path: '/provider/settings', icon: Settings },
    ];

    const handleLogout = () => {
        navigate('/provider-login');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 z-50 h-screen w-64 bg-button-dark text-white flex flex-col transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="h-16 flex items-center px-6 border-b border-slate-700">
                    <span className="text-xl font-bold text-white tracking-tight">Slottr <span className="text-accent">Pro</span></span>
                </div>

                <nav className="flex-1 py-6 px-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname.includes(item.path);
                        const Icon = item.icon;
                        return (
                            <Link 
                                key={item.name}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-accent text-white font-medium shadow-md shadow-accent/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-700">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main content wrapper */}
            <div className="flex-1 flex flex-col lg:ml-64 min-h-screen overflow-x-hidden">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button 
                            className="lg:hidden p-2 text-slate-500 hover:text-blue transition-colors rounded-lg hover:bg-slate-100"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h2 className="text-xl font-semibold text-blue hidden sm:block">
                            {navItems.find(item => location.pathname.includes(item.path))?.name || 'Dashboard'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                            <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center">
                                <User className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium text-slate-700 pr-2">Provider</span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default ProviderLayout;
