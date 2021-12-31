import { getManager, getRepository } from "typeorm";
import { Request, Response } from "express";
import { validate } from "class-validator";
import { EstadoDocumento } from "../entity/EstadoDocumento";
import { Estado } from "../entity/Estado";
import { Documento } from "../entity/Documento";
import { Estudiante } from "../entity/Estudiante";
import { Imagenes } from "../entity/Imagenes";
import { Adjuntos } from "../entity/Adjuntos";
import { Certificados } from "../entity/Certificados";
 
export class TramiteController {

  static getAll = async (req: Request, res: Response) => {
    const tramiteRepository = getRepository(EstadoDocumento);
    let tramite;

    try {
      tramite = await getManager()
        .createQueryBuilder(EstadoDocumento, "est")
        .select("est.id_est_doc", "ID_EST_DOC")
        .addSelect("e.estado", "ESTADO")
        .addSelect("e.fecha", "FECHA_DOC")
        .addSelect("d.nombre", "NOMBRE")
        .addSelect("ed.cod_est", "COD_EST")
        .addSelect("ed.nombre", "ESTUDIANTE")
        .addSelect("ed.apellido", "APELLIDOS")
        .innerJoin(Estado, "e", "est.id_est_doc = e.id_est_doc")
        .innerJoin(Documento, "d", "d.cod_doc = est.cod_doc")
        .innerJoin(Estudiante, "ed", "ed.cod_est = est.cod_est")
        .leftJoin(
          Estado,
          "w",
          "e.id_est_doc = w.id_est_doc AND e.fecha < w.fecha"
        )
        .where("w.id_est_doc is null")
        .getRawMany();
    } catch (e) {
      res.status(404).json({ message: "Something goes wrong! tramite" });
    }
    res.send(tramite);
  }
 
  static getById = async (req: Request, res: Response) => {
    let detalle;
    const { id } = req.params;
    try {
      detalle = await getManager()
        .createQueryBuilder(EstadoDocumento, "est")
        .select("est.id_est_doc", "ID_EST_DOC")
        .addSelect("e.fecha", "FECHA")
        .addSelect("e.estado", "ESTADO")
        .addSelect("e.observaciones", "OBSERVACIONES")
        .innerJoin(Estado, "e", "est.id_est_doc = e.id_est_doc")
        .where("est.ID_EST_DOC = :id", { id: id })
        .orderBy("E.FECHA", "DESC")
        .getRawMany();
    } catch (e) {
      res.status(404).json({ message: "Something goes wrong! detalle" });
    }
    res.send(detalle);
  }

  static getByImg = async (req: Request, res: Response) => {
 
    let imagen;
    const { id } = req.params;
    try {
        imagen = await getManager()
        .createQueryBuilder(Imagenes,"i")  
        .select("i.id_est_doc", "ID_EST_DOC")
        .addSelect("i.fecha","FECHA")
        .addSelect("i.url","URL")
        .where("i.ID_EST_DOC = :id", { id: id })
        .getRawMany();
   
    } catch (e) {
      res.status(404).json({ message: "Something goes wrong! imagen" });
    }
    res.send(imagen);
  }

  static getByAdj = async (req: Request, res: Response) => {
    let adjunto;
    const { id } = req.params;
    try {
        adjunto = await getManager()
        .createQueryBuilder(Adjuntos,"a")
        .select("a.id_est_doc", "ID_EST_DOC")
        .addSelect("a.fecha","FECHA")
        .addSelect("a.url","URL")
        .where("a.ID_EST_DOC = :id", { id: id })
        .getRawMany();
    } catch (e) {
      res.status(404).json({ message: "Something goes wrong! adjunto" });
    }
    res.send(adjunto);
  }

  static getByCer = async (req: Request, res: Response) => {
    let adjunto;
    const { id } = req.params;
    try {
        adjunto = await getManager()
        .createQueryBuilder(Certificados,"c")
        .select("c.id_est_doc", "ID_EST_DOC")
        .addSelect("c.fecha","FECHA")
        .addSelect("c.url","URL")
        .where("c.ID_EST_DOC = :id", { id: id })
        .getRawMany();
    } catch (e) {
      res.status(404).json({ message: "Something goes wrong! Certificados" });
    }
    res.send(adjunto);
  }

  static insertTramite = async (req: Request, res: Response) =>{
    const {id_est_doc,observaciones,estado} = req.body;
    const estadoDetalle = new Estado();
    estadoDetalle.id_est_doc = id_est_doc;
    estadoDetalle.observaciones =observaciones;
    estadoDetalle.estado = estado;
    // Validate
    const validationOpt = {validationError:{target:false,value:false}}
    const errors = await validate(estadoDetalle,validationOpt);
    if(errors.length>0){
        return res.status(400).json(errors);
    }
    const estadoRepository = getRepository(Estado);
    try{
        await estadoRepository.save(estadoDetalle);
    }catch(e){
        return res.status(409).json({message:'Error al registrar estado'});
    }
    // All Ok
    res.send('Nuevo estado agregado');
  }

  static editTramite = async (req: Request, res: Response) =>{
    let tramite;
    const {id_est_doc,observaciones,estado,fecha} = req.body;
    const estadoRepository = getRepository(Estado);
    // try get user
    try{
      tramite = await estadoRepository.findOneOrFail( { id_est_doc: id_est_doc, fecha: fecha} );
      tramite.observaciones = observaciones
      tramite.estado = estado;
    }
    catch(e){
      console.log(e);
        return res.status(404).json({message:'Tramite not found'})
    }
    const validationOpt = {validationError:{target:false,value:false}}
    const errors = await validate(tramite,validationOpt);
    if(errors.length>0){
        return res.status(400).json(errors);
    }

    // Try to save user
    try{
        await estadoRepository.save(tramite);
    }catch(e){
        return res.status(404).json({message:'Error al editar tramite'})
    }
    res.status(201).json({message:'Tramite update'})
  }

  static deleteTramite = async (req: Request, res: Response) =>{
    let tramite:Estado;
    const {id_est_doc,fecha} = req.body;
    const estadoRepository = getRepository(Estado);
    try {
      tramite = await estadoRepository.findOneOrFail( { id_est_doc: id_est_doc, fecha: fecha} );
    }catch(e){
      return res.status(404).json({message:'Tramite not found'})
    }

    // Remove user
    estadoRepository.delete({ id_est_doc: id_est_doc, fecha: fecha});
    res.status(201).json({message:'Tramite deleted'});
  }

  static insertCer = async (req: Request, res: Response) =>{
    const {id_est_doc,url} = req.body;
    const certificado = new Certificados();
    certificado.url = url;
    certificado.id_est_doc =id_est_doc;
    // Validate
    const validationOpt = {validationError:{target:false,value:false}}
    const errors = await validate(certificado,validationOpt);
    if(errors.length>0){
        return res.status(400).json(errors);
    }
    const certificadoRepository = getRepository(Certificados);
    try{
        await certificadoRepository.save(certificado);
    }catch(e){
        return res.status(409).json({message:'Error al registrar certificado'});
    }
    // All Ok
    res.send('Nuevo certificado agregado');
  }

  static deleteCer = async (req: Request, res: Response) =>{
    let certificado:Certificados;
    const {id_est_doc,fecha} = req.body;
    const certificadoRepository = getRepository(Certificados);
    try {
      certificado = await certificadoRepository.findOneOrFail( { id_est_doc: id_est_doc, fecha: fecha} );
    }catch(e){
      return res.status(404).json({message:'Certicado not found'})
    }
    // Remove certificado
    certificadoRepository.delete({ id_est_doc: id_est_doc, fecha: fecha});
    res.status(201).json({message:'Certicado deleted'});
  }
 
 

  static updateCer = async (req: Request, res: Response) =>{
    res.json({
      'message': 'File uploaded succesfully.'
    });
 
  }


}

export default TramiteController;
