import {Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Medico } from "../entities/medicos.entity.js";
import { Repository } from "typeorm";
import { ListMedicoDTO } from "../dtos/output/list-medicos.dto.js";
import { EstadosUsuarios } from "../../auth/enums/estados-usuarios.enum.js";

@Injectable()
export class MedicoService{
    constructor(
    @InjectRepository(Medico)
    private readonly medicoRepository: Repository<Medico>,
  ) {}

  async listarMedicos(): Promise<ListMedicoDTO[]> {
    const medicos = await this.medicoRepository.find({
      where: { usuario: { estadosUsuarios: EstadosUsuarios.ACTIVO } },
      relations: { usuario: true },
      order: { id: "ASC" },
    });

    return medicos.map((medico) => {
      const dto = new ListMedicoDTO();
      dto.id = medico.id;
      dto.idUsuario = medico.idUsuario;
      dto.matricula = medico.matricula;
      dto.valorConsulta = medico.valorConsulta;
      dto.nombres = medico.usuario.nombres;
      dto.apellidos = medico.usuario.apellidos;
      return dto;
    });
  }

  async modificarValorConsulta(idMedico: number, nuevoValor: number): Promise<void> {
    const medico = await this.medicoRepository.findOne({ where: { id: idMedico } });
    if (!medico) throw new NotFoundException('Médico no encontrado');

    medico.valorConsulta = nuevoValor;
    await this.medicoRepository.save(medico);
  }

  
}