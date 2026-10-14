import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { CreateReservaAdminDto } from "../dtos/input/create-reserva-admin.dto.js";
import { UpdateValorConsultaDto } from "../dtos/input/update-valor-consulta.dto.js";
import { ReservasService } from "../services/reservas.service.js";
import { MedicoService } from "../services/medicos.service.js";

@Controller('admin')
export class AdminController{
    constructor(
        private readonly reservaS: ReservasService,
        private readonly medicoS: MedicoService
    ){

    }

    @ApiBearerAuth()
    @Get('reserva')
    async listarReservas(
        @Query('fecha') fecha?: string,
        @Query('id_medico', new ParseIntPipe({ optional: true})) idMedico?: number,
    ): Promise<any[]>{
        return this.reservaS.listarReservasAdmin(fecha, idMedico)
    }

    @ApiBearerAuth()
    @Post('reservas')
    @HttpCode(HttpStatus.CREATED)
    async reservarTurnoAdmin(
        @Body() createReservaAdmin: CreateReservaAdminDto
    ): Promise<any>{
        return this.reservaS.reservarTurnoAdmin(
            createReservaAdmin.id_paciente,
            createReservaAdmin.id_medico,
            createReservaAdmin.fecha_hora
        )
    }

    @ApiBearerAuth()
    @Patch('reservas/:id_reserva/cancelar')
    @HttpCode(HttpStatus.OK)
    async cancelarReservaAdmin(
        @Param('id_reserva', ParseIntPipe) idReserva: number,
    ): Promise<void>{
        return this.reservaS.cancelarReservaAdmin(idReserva);
    }

    @ApiBearerAuth()
    @Patch('medicos/:id_medico/valor-consulta')
    @HttpCode(HttpStatus.OK)
    async modificarValorConsulta(
        @Param('id_medico', ParseIntPipe) idMedico: number,
        @Body() updValorConsulta: UpdateValorConsultaDto,
    ): Promise<void>{
        return this.medicoS.modificarValorConsulta(idMedico, updValorConsulta.valor_consulta)
    }
}