import * as bcrypt from "bcrypt-ts";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { serverEnv } from "@/config/env";
import { db } from "@/infrastructure/db/drizzle";
import { getRedis } from "@/infrastructure/db/redis";
import * as schema from "@/infrastructure/db/schema";

const redis = getRedis();

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { ...schema },
  }),
  secondaryStorage: {
    get: async (key: string) => {
      return await redis.get(key);
    },
    set: async (key: string, value: string) => {
      return await redis.set(key, value);
    },
    delete: async (key: string) => {
      await redis.del(key);
    },
  },
  advanced: {
    database: {
      generateId: false,
    },
  },
  emailAndPassword: {
    enabled: true,
    password: {
      hash(password) {
        return bcrypt.hash(password, 10);
      },
      verify({ password, hash }) {
        return bcrypt.compare(password, hash);
      },
    },
    autoSignIn: true,
  },
  account: {
    accountLinking: {
      allowDifferentEmails: false,
      trustedProviders: ["naver", "google", "kakao"],
    },
  },
  socialProviders: {
    google: {
      clientId: serverEnv.GOOGLE_CLIENT_ID,
      clientSecret: serverEnv.GOOGLE_CLIENT_SECRET,
      async mapProfileToUser(profile) {
        return {
          ...profile,
          email: `${profile.sub}@google.com`,
          emailVerified: true,
          email_verified: true,
        };
      },
    },
    naver: {
      clientId: serverEnv.NAVER_CLIENT_ID,
      clientSecret: serverEnv.NAVER_CLIENT_SECRET,
      async mapProfileToUser(profile) {
        return {
          ...profile,
          email: `${profile.response.id}@naver.com`,
          emailVerified: true,
          email_verified: true,
        };
      },
    },
    kakao: {
      clientId: serverEnv.KAKAO_CLIENT_ID,
      clientSecret: serverEnv.KAKAO_CLIENT_SECRET,
      async mapProfileToUser(profile) {
        return {
          ...profile,
          email: `${profile.id}@kakao.com`,
          emailVerified: true,
          email_verified: true,
        };
      },
    },
  },
  user: {
    additionalFields: {
      role: { type: "string", input: true, required: false },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 1, // 1 day
    updateAge: 60 * 60 * 12, // 12 hours
    freshAge: 60 * 60 * 1, // 1 hour
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  plugins: [nextCookies(), admin()],
});
