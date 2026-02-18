import React, { useState, useEffect } from 'react';
import { Settings, Save, Loader2 } from 'lucide-react';
import { fetchSettings, updateSettings } from '../lib/supabase';

interface AutomationSettingsProps {
    deviceId: number;
    deviceType?: 'cooling' | 'heating';
}

export const AutomationSettings: React.FC<AutomationSettingsProps> = ({ deviceId, deviceType = 'cooling' }) => {
    const [tempOn, setTempOn] = useState<string>('');
    const [tempOff, setTempOff] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    const isHeating = deviceType === 'heating';

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            try {
                // We'll update fetchSettings to accept deviceId
                const data = await fetchSettings(deviceId);
                if (data) {
                    setTempOn(data.temp_on.toString());
                    setTempOff(data.temp_off.toString());
                }
            } catch (error) {
                console.error('Error loading settings:', error);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [deviceId]);

    const handleSave = async () => {
        setIsSaving(true);
        setMessage(null);
        try {
            await updateSettings({
                device_id: deviceId,
                temp_on: parseFloat(tempOn),
                temp_off: parseFloat(tempOff)
            });
            setMessage({ text: 'Configuração salva!', type: 'success' });

            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error('Error saving settings:', error);
            setMessage({ text: 'Erro ao salvar.', type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto mt-6 bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <Settings className="w-6 h-6 text-pool-blue" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                    {isHeating ? 'Automação da Resistência' : 'Automação do Compressor'}
                </h3>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-4">
                    <Loader2 className="animate-spin text-pool-blue" />
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">
                                Ligar em (°C)
                            </label>
                            <input
                                type="number"
                                step="0.5"
                                value={tempOn}
                                onChange={(e) => setTempOn(e.target.value)}
                                className="w-full p-2 rounded-lg border border-slate-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-pool-blue/50 text-slate-700 font-mono"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">
                                Desligar em (°C)
                            </label>
                            <input
                                type="number"
                                step="0.5"
                                value={tempOff}
                                onChange={(e) => setTempOff(e.target.value)}
                                className="w-full p-2 rounded-lg border border-slate-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-pool-blue/50 text-slate-700 font-mono"
                            />
                        </div>
                    </div>

                    {message && (
                        <div className={`text-xs p-2 rounded text-center ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {message.text}
                        </div>
                    )}

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full flex items-center justify-center gap-2 bg-pool-blue hover:bg-sky-700 text-white py-2 rounded-lg transition-colors text-sm font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Salvar Configuração
                    </button>

                    <p className="text-[10px] text-slate-400 text-center mt-2 leading-tight">
                        O {isHeating ? 'aquecimento' : 'compressor'} {isHeating ? 'ligará/desligará' : 'ligará/desligará'} automaticamente conforme a temperatura.
                    </p>
                </div>
            )}
        </div>
    );
};
