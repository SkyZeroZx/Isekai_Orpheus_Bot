import { Router } from "express";
import auth from './auth';
import tramite from "./tramite";
import user from './user';

const routes = Router();

routes.use('/auth',auth);
routes.use('/users',user);
routes.use('/tramite',tramite);
export default routes;