import cors from "cors";

const getAllowedOrigins = () => {
  const envOrigins = process.env.CORS_ALLOWED_ORIGINS || '';
  return envOrigins
    .split(',')
    .map(origin => origin.trim())
    .filter(origin => origin.length > 0);
};

export const corsMiddleware = () => {
  const ALLOWED_ORIGINS = getAllowedOrigins();
  
  return cors({
    origin: (origin, callback) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  });
};
