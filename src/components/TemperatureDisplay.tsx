import React from 'react';
import { ThermometerSun, Snowflake } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TemperatureDisplayProps {
    temperature: number;
    lastUpdate: Date | null;
}

export const TemperatureDisplay: React.FC<TemperatureDisplayProps> = ({ temperature, lastUpdate }) => {
    // Determine color based on temperature
    // < 20: Cold (Blue)
    // 20-28: Good (Green/Teal)
    // > 28: Warm (Orange/Red)

    let colorClass = 'text-pool-blue';
    let Icon = Snowflake;

    if (temperature >= 28) {
        colorClass = 'text-orange-500';
        Icon = ThermometerSun;
    } else if (temperature >= 20) {
        colorClass = 'text-teal-500';
        Icon = ThermometerSun;
    } else {
        colorClass = 'text-blue-500';
        Icon = Snowflake;
    }

    return (
        <div className="flex flex-col items-center justify-center p-8 mb-6 relative">
            {/* Background Circle */}
            <div className="absolute inset-0 bg-white/50 dark:bg-slate-800/50 rounded-full blur-3xl opacity-30 transform scale-75"></div>

            <div className="relative glass rounded-full w-64 h-64 flex flex-col items-center justify-center border-4 border-white/30 shadow-2xl">
                <Icon className={`w-12 h-12 mb-2 ${colorClass} opacity-80`} />

                <div className="flex items-start">
                    <span className="text-6xl font-bold tracking-tighter text-red-600">
                        {temperature.toFixed(1)}
                    </span>
                    <span className="text-3xl mt-2 text-red-600">°C</span>
                </div>

                <div className="mt-4 text-xs text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full">
                    {lastUpdate
                        ? `Atualizado: ${format(lastUpdate, 'HH:mm:ss', { locale: ptBR })}`
                        : 'Aguardando dados...'}
                </div>
            </div>
        </div>
    );
};
