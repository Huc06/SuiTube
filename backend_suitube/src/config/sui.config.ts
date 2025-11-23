import { registerAs } from '@nestjs/config';

export default registerAs('sui', () => ({
  network: process.env.SUI_NETWORK || 'testnet',
  packageId: process.env.SUI_PACKAGE_ID || '',
  platformId: process.env.SUI_PLATFORM_ID || '',
  graphqlUrl: process.env.SUI_GRAPHQL_URL || 'https://api.sui-testnet.walrus.space/graphql',
}));

