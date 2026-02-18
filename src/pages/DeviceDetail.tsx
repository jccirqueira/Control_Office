import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase, type DeviceReading, type DeviceSettings } from '../lib/supabase';
import { Header } from '../components/Header';
import { TemperatureDisplay } from '../components/TemperatureDisplay';
import { ActuatorControl } from '../components/ActuatorControl'; // Will create this from PumpControl
import { TemperatureChart } from '../components/TemperatureChart';
import { ExportControls } from '../components/ExportControls';
import { AutomationSettings } from '../components/AutomationSettings';

export default function DeviceDetail() {
    const { id } = useParams<{ id: string }>();
    const deviceId = parseInt(id || '1');

    const [device, setDevice] = useState<any>(null);
    const [currentReading, setCurrentReading] = useState<DeviceReading | null>(null);
    const [historyData, setHistoryData] = useState<any[]>([]);
    const [isOnline, setIsOnline] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch Device Info
    useEffect(() => {
        const fetchDeviceInfo = async () => {
            const { data } = await supabase.from('devices').select('*').eq('id', deviceId).single();
            if (data) setDevice(data);
        };
        fetchDeviceInfo();
    }, [deviceId]);

    // Realtime & Initial Data
    useEffect(() => {
        // 1. Fetch latest reading
        const fetchLatest = async () => {
            const { data } = await supabase
                .from('device_readings')
                .select('*')
                .eq('device_id', deviceId)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (data) {
                setCurrentReading(data);
                setIsOnline(true);
            }
        };

        fetchLatest();

        // 2. Subscribe to new readings for this device
        const channel = supabase
            .channel(`device_${deviceId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'device_readings',
                filter: `device_id=eq.${deviceId}`
            }, (payload) => {
                setCurrentReading(payload.new as DeviceReading);
                setIsOnline(true);
                // Append to history (simplified)
                setHistoryData(prev => [...prev.slice(1), {
                    time: new Date(payload.new.created_at).getHours() + ':00',
                    temp: payload.new.temp_value
                }]);
            })
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') setIsOnline(true);
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [deviceId]);

    if (!device) return <div className="p-8 text-center">Carregando dispositivo...</div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <Header title={device.name} isOnline={isOnline} />

            <TemperatureDisplay
                temperature={currentReading?.temp_value || 0}
                lastUpdate={currentReading ? new Date(currentReading.created_at) : null}
            />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <ActuatorControl
                    type={device.type}
                    isOn={currentReading?.actuator_status || false}
                    isLoading={isLoading}
                    onToggle={() => { }} // Manual toggle not implemented yet for devices
                />

                <div className="md:col-span-2 lg:col-span-2">
                    <TemperatureChart data={historyData} />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <AutomationSettings deviceId={deviceId} deviceType={device.type} />
                <ExportControls deviceId={deviceId} />
            </div>
        </div>
    );
}
