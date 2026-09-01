import { Menu, Search, Bell } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface ProviderHeaderProps {
    setMobileOpen: (open: boolean) => void;
}

const ProviderHeader = ({ setMobileOpen }: ProviderHeaderProps) => {
    return (
        <header className="h-[100px] bg-slate-50 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
            {/* Mobile menu button */}
            <div className="flex items-center gap-4 lg:hidden">
                <button 
                    className="p-2 text-slate-500 hover:text-blue transition-colors rounded-lg hover:bg-slate-200"
                    onClick={() => setMobileOpen(true)}
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden lg:flex items-center justify-center flex-1 max-w-2xl mx-auto pl-8">
                <div className="relative w-full  bg-white border border-slate-200 rounded-[30px] h-12 flex items-center px-4 hover:border-slate-300 transition-colors">
                    <Search className="w-5 h-5 text-slate-700 shrink-0" />
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="w-full h-full bg-transparent outline-none px-3 text-[15px] placeholder:text-slate-400 text-slate-700"
                    />
                    <div className="shrink-0 flex items-center justify-center font-medium text-slate-500 text-sm">
                        ⌘K
                    </div>
                </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-4 ml-auto lg:ml-0">
                <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-slate-200  hover:bg-slate-50 transition-colors text-slate-700">
                    <Bell className="w-[22px] h-[22px]" />
                </button>
            </div>
        </header>
    );
};

export default ProviderHeader;
