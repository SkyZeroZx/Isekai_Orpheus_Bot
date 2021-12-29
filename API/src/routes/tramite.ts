import { Router } from "express";
import { TramiteController } from "../controller/TramiteController";
import { checkRole } from "../middlewares/role";
import {checkJwt} from "./../middlewares/jwt";

const router = Router();

 
router.get('/',TramiteController.getAll);
router.get('/:id',TramiteController.getById);
router.get('/img/:id',TramiteController.getByImg);
router.get('/adj/:id',TramiteController.getByAdj);
router.get('/cer/:id',TramiteController.getByCer);

 
export default router;


