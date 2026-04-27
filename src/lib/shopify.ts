import '@shopify/shopify-api/adapters/node';
import { shopifyApi, ApiVersion, LogSeverity } from '@shopify/shopify-api';

export const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY || 'placeholder_api_key',
  apiSecretKey: process.env.SHOPIFY_API_SECRET || 'placeholder_api_secret',
  scopes: (process.env.SHOPIFY_SCOPES || 'read_products').split(','),
  hostName: process.env.HOST_NAME ? process.env.HOST_NAME.replace(/https?:\/\//, '') : 'example.com',
  apiVersion: ApiVersion.April26,
  isEmbeddedApp: true,
  logger: {
    level: LogSeverity.Info,
  },
});
