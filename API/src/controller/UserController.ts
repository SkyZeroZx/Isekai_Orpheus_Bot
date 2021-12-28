import {getRepository} from "typeorm";
import {Request, Response} from "express";
import {User} from "../entity/User";
import {validate } from 'class-validator';

export class UserController {
    
    static getAll = async (req: Request, res: Response) =>{ 
        const userRepository = getRepository(User);
        let users
        try {
            users = await userRepository.find();
        } catch (e) {
            res.status(404).json({message:'Something goes wrong!'});
        }
       
        if(users.length > 0){
            res.send(users);
        } else {
            res.status(404).json({message:'Not result'});
        }
    };
 
    static getById = async (req: Request, res: Response) =>{
        const {id} = req.params;
        const userRepository = getRepository(User);
        try{
            const user = await userRepository.findOneOrFail(id);
            res.send(user);
        } 
        catch(e){
            res.status(404).json({message:'Nor result'})
        }

    };

    static newUser = async (req: Request, res: Response) =>{
        const {username,password,role} = req.body;
        const user = new User();
        user.username= username;
        user.password = password;
        user.role = role;
        // Validate
        const validationOpt = {validationError:{target:false,value:false}}
        const errors = await validate(user,validationOpt);
        if(errors.length>0){
            return res.status(400).json(errors);
        }
        // TODO : HASH PASSWORD
        const userRepository = getRepository(User);
        try{
            user.hashPassword();
            await userRepository.save(user);
        }catch(e){
            return res.status(409).json({message:'username already exist'});
        }
        // All Ok
        res.send('User create');
    };

    static editUser = async (req: Request, res: Response) =>{
        let user;
        const {id}= req.params;
        const {username,role}=req.body;
        const userRepository = getRepository(User);
        // try get user
        try{
            user = await userRepository.findOneOrFail(id)
            user.username = username
            user.role = role;
        }
        catch(e){
            return res.status(404).json({message:'User not found'})
        }
        const validationOpt = {validationError:{target:false,value:false}}
        const errors = await validate(user,validationOpt);
        if(errors.length>0){
            return res.status(400).json(errors);
        }

        // Try to save user
        try{
            await userRepository.save(user);
        }catch(e){
            return res.status(404).json({message:'Error saving user'})
        }
        res.status(201).json({message:'User update'})
    };

    static deleteUser = async (req: Request, res: Response) =>{
        const {id} = req.params;
        const userRepository = getRepository(User);
        let user:User;
        try {
            user = await userRepository.findOneOrFail(id);
        }catch(e){
            return res.status(404).json({message:'User not found'});
        }

        // Remove user
        userRepository.delete(id);
        res.status(201).json({message:'User deleted'});
    };

}

export default UserController