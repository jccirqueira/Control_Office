import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';

interface HeaderProps {
    isOnline: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isOnline }) => {
    return (
        <header className="flex justify-between items-center p-6 mb-8 w-full max-w-md mx-auto">
            <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
                Control <span className="text-pool-blue">Office</span>
            </h1>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${isOnline ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
                <span>{isOnline ? 'Online' : 'Offline'}</span>
            </div>
        </header>
    );
};
