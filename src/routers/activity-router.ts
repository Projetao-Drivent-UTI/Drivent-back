import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { listActivies } from "@/controllers";

const activityRouter = Router();

activityRouter
  .all("/*", authenticateToken)
  .get("/:day", listActivies )
  .post("", );

export { activityRouter };
