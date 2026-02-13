import React, { useState, useEffect } from 'react';
import { Settings, Save, Loader2 } from 'lucide-react';
import { fetchSettings, updateSettings } from '../lib/supabase';

export const AutomationSettings: React.FC = () => {
    const [tempOn, setTempOn] = useState<string>('28');
    const [tempOff, setTempOff] = useState<string>('30');
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            try {
                const data = await fetchSettings();
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
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        setMessage(null);
        try {
            await updateSettings({
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
        <div className="w-full max-w-md mx-auto mt-6 p-6 glass rounded-2xl">
            <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider flex items-center gap-2">
                <Settings size={16} /> Automação da Bomba
            </h3>

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
                        A bomba ligará/desligará automaticamente quando a temperatura atingir estes valores.
                    </p>
                </div>
            )}
        </div>
    );
};
