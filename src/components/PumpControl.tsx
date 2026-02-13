import React from 'react';
import { Power, Activity } from 'lucide-react';

interface PumpControlProps {
    isOn: boolean;
    isLoading: boolean;
    onToggle: () => void;
}

export const PumpControl: React.FC<PumpControlProps> = ({ isOn, isLoading, onToggle }) => {
    return (
        <div className={`w-full max-w-md mx-auto p-6 rounded-2xl transition-all duration-500 ${isOn ? 'glass shadow-[0_0_40px_-10px_rgba(0,119,182,0.5)] border-pool-blue/30' : 'glass border-transparent'}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${isOn ? 'bg-pool-blue text-white' : 'bg-slate-100 text-slate-400'}`}>
                        <Activity className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-slate-800">Recirculação</h3>
                        <p className="text-sm text-slate-500">{isOn ? 'Funcionando' : 'Parada'}</p>
                    </div>
                </div>

                <button
                    onClick={onToggle}
                    disabled={isLoading}
                    className={`relative w-16 h-9 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pool-blue ${isOn ? 'bg-pool-blue' : 'bg-slate-300'
                        } ${isLoading ? 'cursor-wait opacity-70' : 'cursor-pointer'}`}
                >
                    <span className="sr-only">Toggle Pump</span>
                    <span
                        className={`absolute left-1 top-1 w-7 h-7 bg-white rounded-full transition-transform duration-300 shadow-sm flex items-center justify-center ${isOn ? 'translate-x-7' : 'translate-x-0'
                            }`}
                    >
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-pool-blue border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Power className={`w-4 h-4 ${isOn ? 'text-pool-blue' : 'text-slate-400'}`} />
                        )}
                    </span>
                </button>
            </div>
        </div>
    );
};
