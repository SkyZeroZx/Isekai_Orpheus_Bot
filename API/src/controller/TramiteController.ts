import { getConnection, getManager, getRepository } from "typeorm";
import { Request, Response } from "express";
import { User } from "../entity/User";
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
        .select("est.id_est_doc", "id_est_doc")
        .addSelect("e.estado", "estado")
        .addSelect("e.fecha", "fecha")
        .addSelect("d.nombre", "nombre_tramite")
        .addSelect("ed.cod_est", "cod_est")
        .addSelect("ed.nombre", "nombre")
        .addSelect("ed.apellido", "apellido")
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
  };

  static getById = async (req: Request, res: Response) => {
    let detalle;
    const { id } = req.params;
    try {
      detalle = await getManager()
        .createQueryBuilder(EstadoDocumento, "est")
        .select("est.id_est_doc", "id_est_doc")
        .addSelect("e.fecha", "fecha")
        .addSelect("e.estado", "estado")
        .addSelect("e.estado", "observaciones")
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
        .select("i.id_est_doc", "id_est_doc")
        .addSelect("i.fecha","fecha")
        .addSelect("i.url","url")
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
        .select("a.id_est_doc", "id_est_doc")
        .addSelect("a.fecha","fecha")
        .addSelect("a.url","url")
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
        .select("c.id_est_doc", "id_est_doc")
        .addSelect("c.fecha","fecha")
        .addSelect("c.url","url")
        .where("c.ID_EST_DOC = :id", { id: id })
        .getRawMany();
    } catch (e) {
      res.status(404).json({ message: "Something goes wrong! Certificados" });
    }
    res.send(adjunto);
  }



}

export default TramiteController;
