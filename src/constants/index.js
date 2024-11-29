export const STORAGE = Object.freeze({
  DATABASE_NAME: 'rbac_system',
});

export const JWT = Object.freeze({
  EXPIRY: '24h',
});

export const REGEX = Object.freeze({
  NAME: /^[a-zA-Z]+$/,
  EMAIL: /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE: /(0|91)?[6-9][0-9]{9}/,
  PASSWORD: /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*_])[a-zA-Z0-9!@#$%^&*_]{6,20}$/,
  IMAGE_URL: /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/,
});
