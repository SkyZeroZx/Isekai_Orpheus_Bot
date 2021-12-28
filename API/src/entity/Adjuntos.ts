import {Entity,Column, PrimaryColumn,CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import {  IsNotEmpty, MaxLength } from "class-validator";
import { EstadoDocumento } from "./EstadoDocumento";

@Entity()
export class Adjuntos {
 
  @PrimaryColumn("int")
  cod_adj: number;


  @ManyToOne(() => EstadoDocumento, Est => Est.id_est_doc)
  @JoinColumn(
    { name: 'id_est_doc', referencedColumnName: 'id_est_doc' }
  )
  id_est_doc: EstadoDocumento;

  @Column("text")
  @IsNotEmpty()
  url: string;


  @Column()
  @CreateDateColumn()
  fecha: Date;


  
}

