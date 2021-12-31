import { Router } from "express";
import { TramiteController } from "../controller/TramiteController";
import { checkRole } from "../middlewares/role";
import {checkJwt} from "./../middlewares/jwt";

const router = Router();
const bodyParser = require('body-parser');  
const multipart = require('connect-multiparty');  
router.use(bodyParser.json());  
router.use(bodyParser.urlencoded({  
    extended: true
}));
const multipartMiddleware = multipart({  
    uploadDir: './upload'
});
 
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
router.post('/certificado/',multipartMiddleware,TramiteController.updateCer);


export default router;


