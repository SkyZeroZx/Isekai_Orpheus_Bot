import {Entity,PrimaryColumn, ManyToOne, JoinColumn, OneToMany, Unique } from "typeorm";
import { IsNotEmpty,MaxLength } from "class-validator";
import { Documento } from "./Documento";
import { Adjuntos } from "./Adjuntos";
import { Estudiante } from "./Estudiante";
import { Estado } from "./Estado";
import { Imagenes } from "./Imagenes";

@Entity()
export class EstadoDocumento {
  @PrimaryColumn({ type: "varchar", length: 35 })
  @OneToMany(() => Adjuntos, Adj=> Adj.id_est_doc, {
    nullable: false
    })
  @OneToMany(() => Estado, Estado=> Estado.id_est_doc, {
      nullable: false
   }) 
   @OneToMany(() => Imagenes, Img=> Img.id_est_doc, {
    nullable: false
    }) 
  @MaxLength(35)
  id_est_doc: Estado;

  @ManyToOne(() => Documento, Documento => Documento.cod_doc, {
    nullable: false
    })
  @JoinColumn({ name: "cod_doc" , referencedColumnName:'cod_doc' })
  cod_doc: Documento;

  @ManyToOne(() => Estudiante, Estudiante => Estudiante.cod_est, {
    nullable: false
    })
  @JoinColumn({ name: "cod_est" })
  cod_est: Estudiante;
    
}
 

