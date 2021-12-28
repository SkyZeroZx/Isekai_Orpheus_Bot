import {Entity,Column, PrimaryColumn,OneToMany } from "typeorm";
import {  IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";
import { EstadoDocumento } from "./EstadoDocumento";
@Entity()
 
export class Estudiante {
 
  @PrimaryColumn({ type: "varchar", length: 35 })
  @OneToMany(() => EstadoDocumento, EstadoDocumento => EstadoDocumento.cod_est)
  cod_est: EstadoDocumento;

  @Column("varchar", { length: 80 })
  @IsNotEmpty()
  nombre: EstadoDocumento;

  @Column("varchar", { length: 120 })
  @MaxLength(120)
  @IsNotEmpty()
  apellido: EstadoDocumento;

  @Column("varchar", { length: 9 })
  @MaxLength(9)
  telefono: EstadoDocumento;

  @Column("varchar", { length: 2 })
  @MaxLength(2)
  dig_dni: EstadoDocumento;

  @Column("varchar", { length: 8 })
  dni: EstadoDocumento;

  @Column()
  @MinLength(6)
  @IsEmail()
  @IsNotEmpty()
  email: string;


  
}

