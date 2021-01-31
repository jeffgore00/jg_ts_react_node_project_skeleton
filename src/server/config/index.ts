import fs from 'fs';
import path from 'path';

type Config = {
  corsWhitelist: string[];
};

export default function getConfig(): Config {
  let env = process.env.NODE_ENV;
  if (!env) env = 'production';
  const configPath = path.join(__dirname, `../config/${env}.json`);
  const config = fs.readFileSync(configPath, 'utf8');
  return JSON.parse(config);
}
