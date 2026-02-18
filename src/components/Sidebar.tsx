import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Refrigerator, Snowflake, GlassWater, Beer, Croissant, X } from 'lucide-react';

const DEVICES = [
    { id: 1, name: 'Balcão Frente (1,2)', icon: Refrigerator, path: '/device/1' },
    { id: 2, name: 'Balcão Frente (3,4)', icon: Refrigerator, path: '/device/2' },
    { id: 3, name: 'Balcão Frente (5,6)', icon: Refrigerator, path: '/device/3' },
    { id: 4, name: 'Balcão Cozinha', icon: Refrigerator, path: '/device/4' },
    { id: 5, name: 'Freezer Cozinha', icon: Snowflake, path: '/device/5' },
    { id: 6, name: 'Freezer Frente', icon: Snowflake, path: '/device/6' },
    { id: 7, name: 'Expositor Coca-Cola', icon: GlassWater, path: '/device/7' },
    { id: 8, name: 'Expositor Imbera', icon: Beer, path: '/device/8' },
    { id: 9, name: 'Estufa Salgados', icon: Croissant, path: '/device/9' },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    return (
        <>
            <div className={`fixed inset-0 bg-black/50 z-40 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />

            <aside className={`fixed top-0 left-0 z-50 h-full w-72 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-r border-slate-200/50 dark:border-slate-700/50 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between p-6">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                        Control <span className="text-pool-blue">Office</span>
                    </h2>
                    <button onClick={onClose} className="lg:hidden text-slate-500 hover:text-slate-700">
                        <X size={24} />
                    </button>
                </div>

                <nav className="px-4 space-y-2 overflow-y-auto h-[calc(100vh-88px)]">
                    <NavLink
                        to="/"
                        className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-pool-blue/10 text-pool-blue font-medium' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        onClick={onClose}
                    >
                        <LayoutDashboard size={20} />
                        <span>Visão Geral</span>
                    </NavLink>

                    <div className="pt-4 pb-2">
                        <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Equipamentos</p>
                    </div>

                    {DEVICES.map((device) => (
                        <NavLink
                            key={device.id}
                            to={device.path}
                            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-pool-blue/10 text-pool-blue font-medium' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            onClick={onClose}
                        >
                            <device.icon size={20} />
                            <span>{device.name}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>
        </>
    );
};
