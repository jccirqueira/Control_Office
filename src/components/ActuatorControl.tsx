import React from 'react';
import { Power, Activity } from 'lucide-react';

interface ActuatorControlProps {
    type: 'cooling' | 'heating';
    isOn: boolean;
    isLoading: boolean;
    onToggle: () => void;
}

export const ActuatorControl: React.FC<ActuatorControlProps> = ({ type, isOn, isLoading, onToggle }) => {
    const label = type === 'cooling' ? 'Compressor' : 'Resistência';

    return (
        <div className={`p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 w-full`}>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${isOn ? 'bg-pool-blue text-white' : 'bg-slate-100 text-slate-400'}`}>
                        <Activity className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-slate-800">{label}</h3>
                        <p className="text-sm text-slate-500">{isOn ? 'Funcionando' : 'Parado'}</p>
                    </div>
                </div>

                <button
                    onClick={onToggle}
                    disabled={isLoading}
                    className={`relative w-16 h-9 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pool-blue ${isOn ? 'bg-pool-blue' : 'bg-slate-300'
                        } ${isLoading ? 'cursor-wait opacity-70' : 'cursor-pointer'}`}
                >
                    <span className="sr-only">Toggle {label}</span>
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
