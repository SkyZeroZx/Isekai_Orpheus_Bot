import { Router } from "express";
import { TramiteController } from "../controller/TramiteController";
import { checkRole } from "../middlewares/role";
import {checkJwt} from "./../middlewares/jwt";
import { multipartMiddleware } from "../middlewares/multipart";


const router = Router();


router.get('/',TramiteController.getAll);
router.get('/:id',TramiteController.getById);
router.get('/img/:id',TramiteController.getByImg);
router.get('/adj/:id',TramiteController.getByAdj);
router.get('/cer/:id',TramiteController.getByCer);
router.post('/',TramiteController.insertTramite);
router.patch('/',TramiteController.editTramite);
router.delete('/',TramiteController.deleteTramite);
router.post('/cer/',TramiteController.insertCer);
router.delete('/cer/',TramiteController.deleteCer);
router.post('/certificado/:id',multipartMiddleware,TramiteController.updateCer);
router.post('/updatecertificado',TramiteController.updateFile);
router.get('/document/:id',TramiteController.getDocument);

export default router;


