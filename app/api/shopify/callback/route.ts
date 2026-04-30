import { NextRequest, NextResponse } from 'next/server';
import { shopify } from '@/lib/shopify';

export async function GET(req: NextRequest) {
  try {
    const request = new Request(req.url, {
      method: req.method,
      headers: req.headers,
    });

    const callbackResponse = await shopify.auth.callback({
      rawRequest: request,
      rawResponse: new Response()
    });

    const session = callbackResponse.session;

    // TODO: Replace in-memory/logging with Prisma/Postgres before real merchants.
    console.log('Shopify offline access token retrieved:', session.accessToken);
    console.log('Session stored for shop:', session.shop);

    const redirectUrl = `https://${session.shop}/admin/apps`;
    return NextResponse.redirect(redirectUrl);
  } catch (error: unknown) {
    console.error('Failed to process callback', error);
    return NextResponse.json({ error: 'Failed to process callback' }, { status: 500 });
  }
}
