import { NextRequest, NextResponse } from 'next/server';
import { shopify } from '@/lib/shopify';

export async function GET(req: NextRequest) {
  const shop = req.nextUrl.searchParams.get('shop');

  if (!shop) {
    return NextResponse.json({ error: 'Missing shop parameter' }, { status: 400 });
  }

  // Convert NextRequest to standard Node-style or Web Request structure that shopify-api expects.
  // We can use shopify.auth.begin
  
  // Create a minimal Web API Request to pass to shopify-api
  const request = new Request(req.url, {
    method: req.method,
    headers: req.headers,
  });

  try {
    const authResponse = await shopify.auth.begin({
      shop,
      callbackPath: '/api/shopify/callback',
      isOnline: false,
      rawRequest: request,
      rawResponse: new Response()
    });

    return NextResponse.redirect(authResponse.headers.get('Location') || '/');
  } catch (error: unknown) {
    console.error('Failed to begin auth', error);
    return NextResponse.json({ error: 'Failed to begin auth' }, { status: 500 });
  }
}
