import cors from "cors";

const ALLOWED_ORIGINS = process.env.CORS_ALLOWED_ORIGINS 
  ? process.env.CORS_ALLOWED_ORIGINS.split(',') 
  : [];
  
export const corsMiddleware = ({ acceptedOrigins = ALLOWED_ORIGINS } = {}) => {
  return cors({
    origin: (origin, callback) => {
      if (ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  });
};
