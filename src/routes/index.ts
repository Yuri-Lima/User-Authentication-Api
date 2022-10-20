import {Router} from "express";
import healthcheck from "./healthcheck.routes";
import auth from "./session.routes";
import user from "./user.routes";
import swagger from "./swagger.routes";

const router = Router();

router.use([healthcheck, auth, user, swagger]);

export default router;
