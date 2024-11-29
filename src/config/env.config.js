import dotenv from 'dotenv';

dotenv.config();

const config = {
  server: {
    port: process.env.SERVER_PORT || 4000,
  },
  database: {
    url: process.env.MONGODB_URL,
  },
  auth: {
    jwtSecretKey: process.env.JWT_SECRET_KEY,
  },
};

const requiredConfig = ['server.port', 'database.url', 'auth.jwtSecretKey'];

requiredConfig.forEach(key => {
  const keys = key.split('.');
  let value = config;

  for (const k of keys) {
    value = value[k];

    if (value === undefined) {
      throw new Error(`Missing required config value: ${key}`);
    }
  }
});

export default config;
