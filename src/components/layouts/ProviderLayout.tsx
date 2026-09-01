import { useState } from 'react';
import type { ReactNode } from 'react';
import ProviderSidebar from './ProviderSidebar';
import ProviderHeader from './ProviderHeader';

interface ProviderLayoutProps {
    children: ReactNode;
}

const ProviderLayout = ({ children }: ProviderLayoutProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            {/* Sidebar Component */}
            <ProviderSidebar 
                mobileOpen={sidebarOpen} 
                setMobileOpen={setSidebarOpen} 
            />

            {/* Main content wrapper */}
            {/* The sidebar is now sticky in the flex layout on desktop, naturally pushing this content. */}
            <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
                
                {/* Header Component */}
                <ProviderHeader 
                    setMobileOpen={setSidebarOpen} 
                />

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default ProviderLayout;
