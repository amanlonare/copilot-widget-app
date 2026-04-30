import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// For local development or mock mode if env vars are missing
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface WidgetSettings {
  id?: string;
  shop_domain: string;
  bot_name: string;
  primary_color: string;
  welcome_message: string;
  created_at?: string;
}

/**
 * Helper to fetch settings by shop domain
 */
export async function getWidgetSettings(shopDomain: string): Promise<WidgetSettings | null> {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials missing, returning null');
    return null;
  }

  const { data, error } = await supabase
    .from('widget_settings')
    .select('*')
    .eq('shop_domain', shopDomain)
    .single();

  if (error) {
    // PGRST116 is the code for "0 rows returned" when using .single()
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching widget settings:', error);
    return null;
  }

  return data as WidgetSettings;
}

/**
 * Helper to update/upsert settings
 */
export async function updateWidgetSettings(settings: WidgetSettings) {
  const { data, error } = await supabase
    .from('widget_settings')
    .upsert(settings, { onConflict: 'shop_domain' });

  if (error) {
    throw new Error(`Error updating widget settings: ${error.message}`);
  }

  return data;
}
