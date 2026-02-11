import dotenv from 'dotenv';
dotenv.config();

export const mongoURI = process.env.MONGO_URI;
export const jwtSecret = process.env.JWT_SECRET;
export const port = process.env.PORT || 3000;

// Or a default export
export default {
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT || 3000
};
