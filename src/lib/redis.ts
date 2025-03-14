import { env } from "@/data/env/server";
import Redis from "ioredis";

const redis = new Redis(env.REDIS_URL);

export default redis;
