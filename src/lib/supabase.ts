import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Missing Supabase Environment Variables!');
}

export const supabase = createClient(SUPABASE_URL || '', SUPABASE_ANON_KEY || '');

export interface PoolData {
    id: number;
    created_at: string;
    temp_value: number;
    relay_status: boolean;
}

export interface PoolSettings {
    id?: number;
    temp_on: number;
    temp_off: number;
    updated_at?: string;
}

export const fetchSettings = async () => {
    const { data, error } = await supabase
        .from('pool_config')
        .select('*')
        .limit(1)
        .single();

    if (error) {
        console.warn('Config not found, returning default.', error);
        return { temp_on: 28, temp_off: 30 } as PoolSettings;
    }
    return data as PoolSettings;
};

export const updateSettings = async (settings: PoolSettings) => {
    // Check if exists, if not insert, else update. 
    // Assuming singleton row id=1 or similar logic.
    const { error } = await supabase
        .from('pool_config')
        .upsert({ id: 1, ...settings, updated_at: new Date() });

    if (error) throw error;
};

export const fetchReportData = async (date: Date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
        .from('pool_data')
        .select('*')
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString())
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data as PoolData[];
};
