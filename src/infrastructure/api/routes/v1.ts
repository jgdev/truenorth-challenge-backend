import Router from "koa-router";

import { Api, ApiDeps } from "..";
import { Context, Next } from "koa";

import CreateUserSessionController from "../controllers/CreateUserSessionController";
import RemoveUserSessionController from "../controllers/RemoveUserSessionController";
import ListRecordsController from "../controllers/ListRecordsController";
import RemoveRecordController from "../controllers/RemoveRecordController";
import ListOperationsController from "../controllers/ListOperationsController";
import CreateRecordController from "../controllers/CreateRecordController";
import GetUserBySessionController from "../controllers/GetUserBySessionController";

export const v1Routers = (app: Api, apiDeps: ApiDeps) => {
  const router = new Router({ prefix: "/v1" });

  // user profile

  router.get("/profile", app.withSession, async (ctx: Context, next: Next) => {
    ctx.body = await new GetUserBySessionController().handle(apiDeps, ctx);
    await next();
  });

  // auth routes

  router.post("/auth/sign-in", async (ctx: Context, next: Next) => {
    ctx.body = await new CreateUserSessionController().handle(apiDeps, ctx);
    await next();
  });

  router.post(
    "/auth/sign-out",
    app.withSession,
    async (ctx: Context, next: Next) => {
      ctx.body =
        (await new RemoveUserSessionController().handle(apiDeps, ctx)) || true;
      await next();
    }
  );

  // record routes

  router.get("/records", app.withSession, async (ctx: Context, next: Next) => {
    ctx.body = await new ListRecordsController().handle(apiDeps, ctx);
    await next();
  });

  router.post("/records", app.withSession, async (ctx: Context, next: Next) => {
    ctx.body = await new CreateRecordController().handle(apiDeps, ctx);
    await next();
  });

  router.delete(
    "/records/:recordId",
    app.withSession,
    async (ctx: Context, next: Next) => {
      ctx.body = await new RemoveRecordController().handle(apiDeps, ctx);
      await next();
    }
  );

  // operations

  router.get(
    "/operations",
    app.withSession,
    async (ctx: Context, next: Next) => {
      ctx.body = await new ListOperationsController().handle(apiDeps, ctx);
      await next();
    }
  );

  // apply routers

  app.use(router.routes());
  app.use(router.allowedMethods());
};

export default v1Routers;
