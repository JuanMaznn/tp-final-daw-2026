import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { EstadosReservasEnum } from "../enums/estados-reservas.enum.js";
import { Medico } from "./medicos.entity.js";
import { Usuario } from "./usuarios.entity.js";

@Entity({ name: "reservas"})
export class Reserva{
    @PrimaryColumn()
    id: number;

    @Column({name: "id_medico"})
    idMedico: number;

    @Column({ name: "id_paciente"})
    idPaciente: number;

    @Column( {name: "fecha_hora", type: "timestamp"})
    fechaHora: Date;

    @Column({ name: "estados_reservas", type: "varchar", default: EstadosReservasEnum.ACTIVO})
    estadosReservas: EstadosReservasEnum

    @Column({ name: "valor_consulta"})
    valorConsulta: number;

    @ManyToOne("Medico", (medico: any) => medico.reserva, { onDelete: "CASCADE"})
    @JoinColumn( { name: "id_medico"})
    medico: any;

    @ManyToOne("Usuario", (usuario: any) => usuario.reservasPacientes , {onDelete: "CASCADE"})
    @JoinColumn( {name: "id_paciente"})
    paciente: any;
}