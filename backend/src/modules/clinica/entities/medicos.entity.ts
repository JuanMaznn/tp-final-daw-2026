import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./usuarios.entity.js";
import { Reserva } from "./reservas.entity.js";

@Entity({name: "medicos"})
export class Medico{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: "id_usuario"})
    idUsuario: number;

    @Column()
    matricula: number;

    @Column({ name: "valor_consulta"})
    valorConsulta: number;

    @OneToOne( "Usuario", (usuario: any) => usuario.medico )
    @JoinColumn( {name: "id_usuario"})
    usuario: any;

    @OneToMany( "Reserva", (reserva: any) => reserva.medico)
    reserva: any[];
}