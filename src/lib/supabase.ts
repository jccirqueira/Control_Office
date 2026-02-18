import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Missing Supabase Environment Variables!');
}

export const supabase = createClient(SUPABASE_URL || '', SUPABASE_ANON_KEY || '');

export interface DeviceReading {
    id: number;
    created_at: string;
    device_id: number;
    temp_value: number;
    actuator_status: boolean;
}

export interface DeviceSettings {
    id?: number;
    device_id: number;
    temp_on: number;
    temp_off: number;
    updated_at?: string;
}

export const fetchSettings = async (deviceId: number) => {
    const { data, error } = await supabase
        .from('device_settings')
        .select('*')
        .eq('device_id', deviceId)
        .single();

    if (error) {
        console.warn('Config not found, returning default.', error);
        // Default based on type would require checking device type, but for safety return a safe default
        return { temp_on: 4, temp_off: 2, device_id: deviceId } as DeviceSettings;
    }
    return data as DeviceSettings;
};

export const updateSettings = async (settings: DeviceSettings) => {
    // Upsert based on device_id
    // We first need the row ID if it exists, or just use upsert on device_id unique constraint if configured?
    // The table definition has device_id as UNIQUE, so upsert works.

    // We need to exclude 'id' from the object if it is undefined to avoid error, 
    // but supabase upsert handles it if we match on the unique key.
    // However, to be safe, let's select first or just trust upsert with OnConflict.

    const { error } = await supabase
        .from('device_settings')
        .upsert({ ...settings, updated_at: new Date() }, { onConflict: 'device_id' });

    if (error) throw error;
};

export const fetchReportData = async (deviceId: number, date: Date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
        .from('device_readings')
        .select('*')
        .eq('device_id', deviceId)
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString())
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data as DeviceReading[];
};
