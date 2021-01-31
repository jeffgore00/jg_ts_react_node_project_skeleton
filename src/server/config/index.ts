import * as developmentConfig from './development.json';
import * as testConfig from './test.json';
import * as productionConfig from './production.json';

type Config = {
  corsWhitelist: string[];
};

const configMap: { [key: string]: Config } = {
  development: developmentConfig,
  test: testConfig,
  production: productionConfig,
};

export default function getConfig(): Config {
  const env = process.env.NODE_ENV || 'production';

  return configMap[env];
}
