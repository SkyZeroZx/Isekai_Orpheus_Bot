import {Entity,PrimaryGeneratedColumn,Column, PrimaryColumn, OneToMany } from "typeorm";
import {  IsNotEmpty, MaxLength } from "class-validator";
import { EstadoDocumento } from "./EstadoDocumento";
@Entity()
 
export class Documento {
  
  @PrimaryColumn({ type: "int", width: 35 })
  @OneToMany(() => EstadoDocumento, EstadoDocumento => EstadoDocumento.cod_doc)
  cod_doc: EstadoDocumento;


  @Column("varchar", { length: 100 })
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;


  
}

