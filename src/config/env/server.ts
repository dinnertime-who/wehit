import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),
  R2_ACCOUNT_ID: z.string(),
  R2_BUCKET_NAME: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number(),
  SMTP_USER: z.string(),
  SMTP_PASSWORD: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  NAVER_CLIENT_ID: z.string(),
  NAVER_CLIENT_SECRET: z.string(),
  KAKAO_CLIENT_ID: z.string(),
  KAKAO_CLIENT_SECRET: z.string(),
});

export const serverEnv = serverEnvSchema.parse(process.env);
