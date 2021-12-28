import { Router } from "express";
import { TramiteController } from "../controller/TramiteController";
import { checkRole } from "../middlewares/role";
import {checkJwt} from "./../middlewares/jwt";

const router = Router();

// Get all tramites
router.get('/',TramiteController.getAll);
 

export default router;


