import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm"
import { Reserva } from "../entities/reservas.entity.js";
import { And, Between, LessThan, MoreThan, Repository } from "typeorm";
import { Medico } from "../entities/medicos.entity.js";
import { EstadosReservasEnum } from "../enums/estados-reservas.enum.js";
import { ListReservaDTO, ListReservaMedicoDTO, ListReservaPacienteDTO } from "../dtos/output/list-reserva.dto.js";
import { CreateReservaAdminDto } from "../dtos/input/create-reserva-admin.dto.js";

@Injectable()
export class ReservasService {
    constructor(
        @InjectRepository(Reserva) private readonly reservaR: Repository<Reserva>,
        @InjectRepository(Medico) private readonly medicoR: Repository<Medico>
    ) { }


    async obtenerTurnosUsuario(idUsuario: number): Promise<ListReservaDTO[]> {
        const reservas = await this.reservaR.find({
            where: { idPaciente: idUsuario },
            select: {
                id: true,
                fechaHora: true,
                estadosReservas: true,
                valorConsulta: true,
                medico: {
                    id: true,
                    usuario: {
                        nombres: true,
                        apellidos: true,
                    },
                },
                paciente: {
                    nombres: true,
                    apellidos: true,
                },
            },
            relations: { medico: { usuario: true }, paciente: true },
            order: { fechaHora: 'ASC' },
        });
        const dtoList: ListReservaDTO[] = [];
        for (const r of reservas) {
            const dto = new ListReservaDTO();
            dto.id = r.id;
            dto.fechaHora = r.fechaHora;
            dto.estado = r.estadosReservas;
            dto.valorConsulta = r.valorConsulta;
            const medicoDto = new ListReservaMedicoDTO();
            medicoDto.nombres = r.medico.usuario.nombres;
            medicoDto.apellidos = r.medico.usuario.apellidos;
            dto.medico = medicoDto;
            const pacienteDto = new ListReservaPacienteDTO();
            pacienteDto.nombres = r.paciente.nombres;
            pacienteDto.apellidos = r.paciente.apellidos;
            dto.paciente = pacienteDto;
            dtoList.push(dto);
        }
        return dtoList;
    }

    async crearReservaPaciente(dto: {idPaciente: number, idMedico: number, fechaHora: string}): Promise<{ id: number }> {
    const medico = await this.medicoR.findOne({ 
      where: { id: dto.idMedico },
      relations: { usuario: true }
    });
    if (!medico) throw new NotFoundException('Médico no encontrado');

    const fechaInicio = new Date(dto.fechaHora);
    this.validarReglasNegocioCreacion(fechaInicio);
    await this.validarHorarioYDisponibilidadMedico(dto.idMedico, fechaInicio);

    const nuevaReserva = this.reservaR.create({
      idPaciente: dto.idPaciente,
      idMedico: dto.idMedico,
      fechaHora: dto.fechaHora,
      estadosReservas: EstadosReservasEnum.ACTIVO,
      valorConsulta: medico.valorConsulta,
    });

    const guardada = await this.reservaR.save(nuevaReserva);
    return { id: guardada.id };
  }

  async cancelarReservaPaciente(idReserva: number, idUsuario: number): Promise<void> {
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
    await this.reservaR.save(reserva);
  }

  async obtenerReservaPorFecha(idMedico: number, fechaStr: string): Promise<ListReservaDTO[]> {
    const fechaInicio = new Date(`${fechaStr}T00:00:00`);
    const fechaFin = new Date(`${fechaStr}T23:59:59`);

    const reservas = await this.reservaR.find({
      where: {
        idMedico: idMedico,
        fechaHora: Between(fechaInicio, fechaFin),
      },
      select: {
        id: true,
        fechaHora: true,
        estadosReservas: true,
        valorConsulta: true,
        medico: {
          id: true,
          usuario: {
            nombres: true,
            apellidos: true,
          },
        },
        paciente: {
          nombres: true,
          apellidos: true,
        },
      },
      relations: {
        medico: { usuario: true },
        paciente: true,
      },
      order: { fechaHora: 'ASC' },
    });
    const dtoList: ListReservaDTO[] = [];
    for (const r of reservas) {
      const dto = new ListReservaDTO();
      dto.id = r.id;
      dto.fechaHora = r.fechaHora;
      dto.estado = r.estadosReservas;
      dto.valorConsulta = r.valorConsulta;
      const medicoDto = new ListReservaMedicoDTO();
      medicoDto.nombres = r.medico.usuario.nombres;
      medicoDto.apellidos = r.medico.usuario.apellidos;
      dto.medico = medicoDto;
      const pacienteDto = new ListReservaPacienteDTO();
      pacienteDto.nombres = r.paciente.nombres;
      pacienteDto.apellidos = r.paciente.apellidos;
      dto.paciente = pacienteDto;
      dtoList.push(dto);
    }
    return dtoList;
  }

  async obtenerIdMedicoDeUsuario(idUsuario: number): Promise<number> {
    const medico = await this.medicoR.findOne({ where: { idUsuario } });
    if (!medico) throw new ForbiddenException('El usuario no es un médico');
    return medico.id;
  }

  async cambiarEstadoReserva(idReserva: number, nuevoEstado: EstadosReservasEnum, idMedico?: number): Promise<void> {
    const reserva = await this.reservaR.findOne({ where: { id: idReserva } });
    if (!reserva) throw new NotFoundException('Reserva no encontrada');

    if (idMedico !== undefined && reserva.idMedico !== idMedico) {
      throw new ForbiddenException('No tiene permisos para modificar el turno de otro médico');
    }

    if (reserva.estadosReservas !== EstadosReservasEnum.ACTIVO) {
      throw new BadRequestException('Solo se pueden marcar turnos activos.');
    }

    reserva.estadosReservas = nuevoEstado;
    await this.reservaR.save(reserva);
  }

  async listarReservasAdmin(fecha?: string, idMedico?: number, idPaciente?: number): Promise<ListReservaDTO[]> {
    const where: any = {};
    if (idMedico) where.idMedico = idMedico;
    if (idPaciente) where.idPaciente = idPaciente;
    if (fecha) {
      const fechaInicio = new Date(`${fecha}T00:00:00`);
      const fechaFin = new Date(`${fecha}T23:59:59`);
      where.fechaHora = Between(fechaInicio, fechaFin);
    }

    const reservas = await this.reservaR.find({
      where,
      select: {
        id: true,
        fechaHora: true,
        estadosReservas: true,
        valorConsulta: true,
        medico: {
          id: true,
          usuario: {
            nombres: true,
            apellidos: true,
          },
        },
        paciente: {
          nombres: true,
          apellidos: true,
        },
      },
      relations: {
        medico: { usuario: true },
        paciente: true,
      },
      order: { fechaHora: 'ASC' },
    });
    const dtoList: ListReservaDTO[] = [];
    for (const r of reservas) {
      const dto = new ListReservaDTO();
      dto.id = r.id;
      dto.fechaHora = r.fechaHora;
      dto.estado = r.estadosReservas;
      dto.valorConsulta = r.valorConsulta;
      const medicoDto = new ListReservaMedicoDTO();
      medicoDto.nombres = r.medico.usuario.nombres;
      medicoDto.apellidos = r.medico.usuario.apellidos;
      dto.medico = medicoDto;
      const pacienteDto = new ListReservaPacienteDTO();
      pacienteDto.nombres = r.paciente.nombres;
      pacienteDto.apellidos = r.paciente.apellidos;
      dto.paciente = pacienteDto;
      dtoList.push(dto);
    }
    return dtoList;
  }

  async reservarTurnoAdmin(dto: CreateReservaAdminDto): Promise<{ id: number }> {
    const medico = await this.medicoR.findOne({ where: { id: dto.id_medico }});
    if (!medico) throw new NotFoundException('Médico no encontrado');

    const fechaInicio = new Date(dto.fecha_hora);
    this.validarReglasNegocioCreacion(fechaInicio);
    await this.validarHorarioYDisponibilidadMedico(dto.id_medico, fechaInicio);

    const nuevaReserva = this.reservaR.create({
      idPaciente: dto.id_paciente,
      idMedico: dto.id_medico,
      fechaHora: fechaInicio,
      estadosReservas: EstadosReservasEnum.ACTIVO,
      valorConsulta: medico.valorConsulta,
    });

    const guardada = await this.reservaR.save(nuevaReserva);

    return { id: guardada.id }; 
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

  private async validarHorarioYDisponibilidadMedico(idMedico: number, fechaInicio: Date): Promise<void> {
    const minutosInicio = fechaInicio.getHours() * 60 + fechaInicio.getMinutes();
    const minutosFinTurno = minutosInicio + 60;
    const minutosApertura = 8 * 60;
    const minutosCierre = 16 * 60;

    if (minutosInicio < minutosApertura || minutosFinTurno > minutosCierre) {
      throw new BadRequestException('El horario de atención es de 08:00 a 16:00 hs.');
    }

    const unaHoraMs = 60 * 60 * 1000;
    const turnoOcupado = await this.reservaR.findOne({
      where: {
        idMedico,
        estadosReservas: EstadosReservasEnum.ACTIVO,
        fechaHora: And(
          MoreThan(new Date(fechaInicio.getTime() - unaHoraMs)),
          LessThan(new Date(fechaInicio.getTime() + unaHoraMs)),
        ),
      },
    });

    if (turnoOcupado) {
      throw new BadRequestException('El horario seleccionado ya se encuentra ocupado.');
    }
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