import {Router} from "express";
import healthcheck from "./healthcheck.routes";
import auth from "./auth.routes";
import user from "./user.routes";

const router = Router();

router.use(healthcheck);
router.use(auth);
router.use(user);

export default router;
