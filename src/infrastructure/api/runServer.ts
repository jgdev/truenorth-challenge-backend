import debug from "debug";
import dotenv from "dotenv";
import { ApiDeps, createApi } from ".";
import { APP_NAME, httpLogger } from "@/core/utils/logger";
import { PrismaClient } from "@prisma/client";
import PgUserRepository from "@/lib/repository/PgUserRepository";
import { UserStatus } from "@/core/entities/User";

dotenv.config();

if (!process.env.DEBUG) debug.enable(`${APP_NAME}:info*,${APP_NAME}:error*`);

export const getDependencies = async () => {
  const prismaClient = new PrismaClient();
  await prismaClient.$connect();

  let apiDependencies: ApiDeps;
  const mongoClient = {};
  const redisClient = null;
  apiDependencies = {} as ApiDeps;

  return apiDependencies;
};

(async () => {
  const httpPort = process.env.PORT || process.env.NODE_PORT || 3001;
  const apiDeps = await getDependencies();
  const api = createApi(apiDeps, false);
  api.listen(httpPort, () => {
    httpLogger.info(`Api service running in http://localhost:${httpPort}/`);
  });
})().catch(console.error);
