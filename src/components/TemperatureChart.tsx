import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface DataPoint {
    time: string;
    temp: number;
}

interface TemperatureChartProps {
    data: DataPoint[];
}

export const TemperatureChart: React.FC<TemperatureChartProps> = ({ data }) => {
    return (
        <div className="w-full max-w-md mx-auto mt-6 p-6 glass rounded-2xl">
            <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">Histórico (24h)</h3>
            <div className="h-48 w-full relative" style={{ minHeight: '192px', minWidth: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0077b6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#0077b6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="time"
                            hide={true}
                        />
                        <YAxis
                            domain={['auto', 'auto']}
                            hide={true}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="temp"
                            stroke="#0077b6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorTemp)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
