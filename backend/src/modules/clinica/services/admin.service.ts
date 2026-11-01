import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Usuario } from "../entities/usuarios.entity.js";
import { ListPacienteDTO } from "../dtos/output/list-paciente.dto.js";
import { EstadosUsuarios } from "../../auth/enums/estados-usuarios.enum.js";
import { RolesUsuariosEnum } from "../../auth/enums/roles-usuarios.enum.js";

@Injectable()
export class AdminService{
    constructor(
        @InjectRepository(Usuario)
        private readonly usuarioRepository: Repository<Usuario>,
    ) {}

    // Lista de pacientes activos, para que el administrador elija a nombre de quién reserva un turno.
    async listarPacientes(): Promise<ListPacienteDTO[]> {
        const pacientes = await this.usuarioRepository.find({
            where: {
                rolesUsuarios: RolesUsuariosEnum.PACIENTE,
                estadosUsuarios: EstadosUsuarios.ACTIVO,
            },
            order: { apellidos: "ASC", nombres: "ASC" },
        });

        return pacientes.map((paciente) => {
            const dto = new ListPacienteDTO();
            dto.id = paciente.id;
            dto.documento = paciente.documento;
            dto.nombres = paciente.nombres;
            dto.apellidos = paciente.apellidos;
            return dto;
        });
    }
}
