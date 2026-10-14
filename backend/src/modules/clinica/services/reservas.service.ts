import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm"
import { Reserva } from "../entities/reservas.entity.js";
import { Between, Repository } from "typeorm";
import { Medico } from "../entities/medicos.entity.js";
import { EstadosReservasEnum } from "../enums/estados-reservas.enum.js";

@Injectable()
export class ReservasService {
    constructor(
        @InjectRepository(Reserva) private readonly reservaR: Repository<Reserva>,
        @InjectRepository(Medico) private readonly medicoR: Repository<Medico>
    ) { }


    async obtenerTurnosUsuario(idUsuario: number): Promise<Reserva[]> {
        return this.reservaR.find({
            where: { idPaciente: idUsuario },
            relations: { medico: true},
            order: { fechaHora: 'ASC' },
        });
    }

    async crearReservaPaciente(dto: {idPaciente: number, idMedico: number, fechaHora: string}): Promise<Reserva> {
    const medico = await this.medicoR.findOne({ 
      where: { id: dto.idMedico },
      relations: { usuario: true }
    });
    if (!medico) throw new NotFoundException('Médico no encontrado');

    const fechaInicio = new Date(dto.fechaHora);
    this.validarReglasNegocioCreacion(fechaInicio);

    const hora = fechaInicio.getHours();
    if (hora < 8 || hora >= 16) {
      throw new BadRequestException('El horario de atención es de 08:00 a 16:00 hs.');
    }

    const turnoOcupado = await this.reservaR.findOne({
      where: {
        idMedico: dto.idMedico,
        fechaHora: fechaInicio,
        estadosReservas: EstadosReservasEnum.ACTIVO,
      }
    });

    if (turnoOcupado) {
      throw new BadRequestException('El horario seleccionado ya se encuentra ocupado.');
    }

    const nuevaReserva = this.reservaR.create({
      idPaciente: dto.idPaciente,
      idMedico: dto.idMedico,
      fechaHora: dto.fechaHora,
      estadosReservas: EstadosReservasEnum.ACTIVO,
      valorConsulta: medico.valorConsulta,
    });

    return this.reservaR.save(nuevaReserva);
  }

  async cancelarReservaPaciente(idReserva: number, idUsuario: number): Promise<Reserva> {
    const reserva = await this.reservaR.findOne({ where: { id: idReserva } });
    if (!reserva) throw new NotFoundException('Reserva no encontrada');

    if (reserva.idPaciente !== idUsuario) {
      throw new ForbiddenException('No tienes permisos para cancelar esta reserva');
    }

    const hoy = new Date();
    const fechaConsulta = new Date(reserva.fechaHora);
    
    hoy.setHours(0, 0, 0, 0);
    fechaConsulta.setHours(0, 0, 0, 0);

    const diferenciaDias = (fechaConsulta.getTime() - hoy.getTime()) / (1000 * 3600 * 24);
    if (diferenciaDias < 1) {
      throw new BadRequestException('Las cancelaciones de pacientes solo se permiten hasta el día anterior a la consulta.');
    }

    reserva.estadosReservas = EstadosReservasEnum.CANCELADO; 
    return this.reservaR.save(reserva);
  }

  async obtenerReservaPorFecha(idMedico: number, fechaStr: string): Promise<Reserva[]> {
    const fechaInicio = new Date(`${fechaStr}T00:00:00`);
    const fechaFin = new Date(`${fechaStr}T23:59:59`);

    return this.reservaR.find({
      where: {
        idMedico: idMedico,
        fechaHora: Between(fechaInicio, fechaFin),
      },
      relations: {
        paciente: true,
      },
      order: { fechaHora: 'ASC' },
    });
  }

  async cambiarEstadoReserva(idReserva: number, nuevoEstado: EstadosReservasEnum): Promise<Reserva> {
    const reserva = await this.reservaR.findOne({ where: { id: idReserva } });
    if (!reserva) throw new NotFoundException('Reserva no encontrada');

    reserva.estadosReservas = nuevoEstado;
    return this.reservaR.save(reserva);
  }

  async listarReservasAdmin(fecha?: string, idMedico?: number): Promise<Reserva[]> {
    const where: any = {};
    if (idMedico) where.idMedico = idMedico;
    if (fecha) {
      const fechaInicio = new Date(`${fecha}T00:00:00`);
      const fechaFin = new Date(`${fecha}T23:59:59`);
      where.fechaHora = Between(fechaInicio, fechaFin);
    }

    return this.reservaR.find({
      where,
      relations: {
        medico: { usuario: true },
        paciente: true,
      },
      order: { fechaHora: 'ASC' },
    });
  }

  async reservarTurnoAdmin(idPaciente: number, idMedico: number, fechaHoraStr: string): Promise<Reserva> {
    const medico = await this.medicoR.findOne({ where: { id: idMedico } });
    if (!medico) throw new NotFoundException('Médico no encontrado');

    const fechaInicio = new Date(fechaHoraStr);
    this.validarReglasNegocioCreacion(fechaInicio);

    const hora = fechaInicio.getHours();
    if (hora < 8 || hora >= 16) {
      throw new BadRequestException('El horario de atención es de 08:00 a 16:00 hs.');
    }

    const turnoOcupado = await this.reservaR.findOne({
      where: {
        idMedico: idMedico,
        fechaHora: fechaInicio,
        estadosReservas: EstadosReservasEnum.ACTIVO,
      }
    });

    if (turnoOcupado) {
      throw new BadRequestException('El horario seleccionado ya se encuentra ocupado.');
    }

    const nuevaReserva = this.reservaR.create({
      idPaciente,
      idMedico,
      fechaHora: fechaInicio,
      estadosReservas: EstadosReservasEnum.ACTIVO,
      valorConsulta: medico.valorConsulta,
    });

    return this.reservaR.save(nuevaReserva);
  }

  async cancelarReservaAdmin(idReserva: number): Promise<void> {
    const reserva = await this.reservaR.findOne({ where: { id: idReserva } });
    if (!reserva) throw new NotFoundException('Reserva no encontrada');

    const ahora = new Date();
    if (ahora >= new Date(reserva.fechaHora)) {
      throw new BadRequestException('No se puede cancelar la reserva una vez iniciada la consulta.');
    }

    reserva.estadosReservas = EstadosReservasEnum.CANCELADO;
    await this.reservaR.save(reserva);
  }

  private validarReglasNegocioCreacion(fechaInicio: Date) {
    const ahora = new Date();
    const limiteMaximo = new Date();
    limiteMaximo.setDate(ahora.getDate() + 30); // Máximo 30 días de anticipación

    if (fechaInicio < ahora) {
      throw new BadRequestException('No se pueden reservar turnos en el pasado.');
    }

    if (fechaInicio > limiteMaximo) {
      throw new BadRequestException('Las reservas se pueden realizar con un máximo de 30 días de anticipación.');
    }
  }
}