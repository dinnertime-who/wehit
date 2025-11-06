import { Redis } from "ioredis";
import { serverEnv } from "@/config/env/server";

export type GlobalWithRedis = typeof globalThis & {
  redis: Redis | null;
};
const globalWithRedis: GlobalWithRedis = globalThis as GlobalWithRedis;

export const getRedis = () => {
  if (globalWithRedis.redis) {
    return globalWithRedis.redis;
  }
  globalWithRedis.redis = new Redis(serverEnv.REDIS_URL);
  return globalWithRedis.redis;
};
