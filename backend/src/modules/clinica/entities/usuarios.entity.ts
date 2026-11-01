import { Column, PrimaryGeneratedColumn, OneToOne, Entity, OneToMany } from "typeorm";
import { EstadosUsuarios } from "../../auth/enums/estados-usuarios.enum.js";
import { RolesUsuariosEnum } from "../../auth/enums/roles-usuarios.enum.js";

@Entity({name: "usuarios"})
export class Usuario{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    documento: string;

    @Column()
    apellidos: string;

    @Column()
    nombres: string;

    @Column()
    email: string;

    @Column()
    clave: string;

    @Column({name: "estado", type:"enum", enum: EstadosUsuarios})
    estadosUsuarios: EstadosUsuarios;

    @Column({name: "rol", type: "enum", enum: RolesUsuariosEnum})
    rolesUsuarios: RolesUsuariosEnum;

    @OneToOne( "Medico", (medico: any) => medico.usuario)
    medico: any;

    @OneToMany( "Reserva", (reserva: any) => reserva.paciente)
    reservasPacientes: any[]
}   