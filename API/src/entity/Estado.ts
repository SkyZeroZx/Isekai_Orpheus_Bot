import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { IsNotEmpty, MaxLength } from "class-validator";
import { EstadoDocumento } from "./EstadoDocumento";

@Entity()
export class Estado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @CreateDateColumn()
  fecha: Date;

  @ManyToOne(() => EstadoDocumento, Est => Est.id_est_doc, {
    nullable: false,
  })
  @JoinColumn({ name: "id_est_doc", referencedColumnName: "id_est_doc" })
  id_est_doc: EstadoDocumento;

  @Column("varchar", { length: 50 })
  @IsNotEmpty()
  @MaxLength(50)
  estado: string;

  @Column("text")
  @IsNotEmpty()
  observaciones: string;
}
