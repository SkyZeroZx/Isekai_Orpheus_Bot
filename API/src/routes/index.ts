import { Router } from "express";
import auth from './auth';
import user from './user';

const routes = Router();

routes.use('/auth',auth);
routes.use('/users',user);
routes.use('/tramite',user);
export default routes;