import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Menu } from 'lucide-react';

export const Layout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden relative">
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-pool-blue/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="lg:pl-72 min-h-screen transition-all duration-300">
                <header className="flex lg:hidden items-center justify-between p-4 sticky top-0 z-30 bg-white/50 backdrop-blur-md">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600">
                        <Menu size={24} />
                    </button>
                    <h1 className="text-lg font-bold text-slate-800">Control Office</h1>
                    <div className="w-8" /> {/* Spacer */}
                </header>

                <main className="container mx-auto p-4 lg:p-8">
                    <Outlet />
                </main>

                <footer className="mt-12 text-center text-slate-400 text-sm pb-8">
                    <p>© 2026 Control Office</p>
                    <p className="mt-1 text-xs opacity-70">Powered By Cacir Soluções Tecnológicas</p>
                </footer>
            </div>
        </div>
    );
};
