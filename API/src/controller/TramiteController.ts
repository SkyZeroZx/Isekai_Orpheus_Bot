import {getConnection, getRepository} from "typeorm";
import {Request, Response} from "express";
import {User} from "../entity/User";
import {validate } from 'class-validator';
import { EstadoDocumento } from "../entity/EstadoDocumento";

export class TramiteController {
    
    static getAll = async (req: Request, res: Response) =>{ 
        const userRepository = getRepository(User);
        let users 
        try {
            users =  getConnection()
            .createQueryBuilder()
            .select("fecha")
            .from(EstadoDocumento, "EstadoDocumento")
            .where("user.id = :id", { id: 1 })
            .getOne();
            

        } catch (e) {
            res.status(404).json({message:'Something goes wrong! tramite'});
        }
        res.send(users);
      /*  if(users.length > 0){
        
        } else {
            res.status(404).json({message:'Not result'});
        }*/
    };
 
}

export default TramiteController