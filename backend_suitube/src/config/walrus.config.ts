import { registerAs } from '@nestjs/config';

export default registerAs('walrus', () => ({
  publisherUrl: process.env.WALRUS_PUBLISHER_URL || 'https://publisher.walrus-testnet.walrus.space',
  aggregatorUrl: process.env.WALRUS_AGGREGATOR_URL || 'https://aggregator.walrus-testnet.walrus.space',
}));

