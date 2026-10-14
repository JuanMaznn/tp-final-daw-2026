import {Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Medico } from "../entities/medicos.entity.js";
import { Repository } from "typeorm";

@Injectable()
export class MedicoService{
    constructor(
    @InjectRepository(Medico)
    private readonly medicoRepository: Repository<Medico>,
  ) {}

  async modificarValorConsulta(idMedico: number, nuevoValor: number): Promise<void> {
    const medico = await this.medicoRepository.findOne({ where: { id: idMedico } });
    if (!medico) throw new NotFoundException('Médico no encontrado');

    medico.valorConsulta = nuevoValor;
    await this.medicoRepository.save(medico);
  }

  
}