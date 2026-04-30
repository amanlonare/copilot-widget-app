import { NextResponse } from 'next/server';
import { getWidgetSettings, updateWidgetSettings, WidgetSettings } from '@/lib/supabase/client';

const DEFAULT_SETTINGS = {
  bot_name: 'Copilot',
  primary_color: '#000000',
  welcome_message: 'Hi! How can I help you today?',
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const shop = searchParams.get('shop');

  if (!shop) {
    return NextResponse.json({ error: 'Missing shop parameter' }, { status: 400 });
  }

  try {
    const settings = await getWidgetSettings(shop);
    
    const response = NextResponse.json(settings || { ...DEFAULT_SETTINGS, shop_domain: shop });
    
    // Add CORS headers for cross-domain embedding
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { shop_domain, bot_name, primary_color, welcome_message } = body;

    if (!shop_domain) {
      return NextResponse.json({ error: 'Missing shop_domain' }, { status: 400 });
    }

    const settings: WidgetSettings = {
      shop_domain,
      bot_name: bot_name || DEFAULT_SETTINGS.bot_name,
      primary_color: primary_color || DEFAULT_SETTINGS.primary_color,
      welcome_message: welcome_message || DEFAULT_SETTINGS.welcome_message,
    };

    await updateWidgetSettings(settings);

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('API POST Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Handle preflight OPTIONS requests for CORS
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}
