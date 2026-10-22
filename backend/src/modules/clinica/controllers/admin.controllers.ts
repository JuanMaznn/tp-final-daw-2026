import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse } from "@nestjs/swagger";
import { ListReservaDTO } from "../dtos/output/list-reserva.dto.js";
import { AuthGuard } from "../../auth/guards/auth.guard.js";
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
    @UseGuards(AuthGuard)
    @ApiOkResponse({ type: ListReservaDTO, isArray: true })
    @Get('reserva')
    async listarReservas(
        @Query('fecha') fecha?: string,
        @Query('id_medico', new ParseIntPipe({ optional: true})) idMedico?: number,
    ): Promise<ListReservaDTO[]>{
        return this.reservaS.listarReservasAdmin(fecha, idMedico)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Post('reservas')
    @HttpCode(HttpStatus.CREATED)
    async reservarTurnoAdmin(
        @Body() dto: CreateReservaAdminDto
    ): Promise<{ id: number }>{
        return this.reservaS.reservarTurnoAdmin(dto)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Patch('reservas/:id_reserva/cancelar')
    @HttpCode(HttpStatus.OK)
    async cancelarReservaAdmin(
        @Param('id_reserva', ParseIntPipe) idReserva: number,
    ): Promise<void>{
        return this.reservaS.cancelarReservaAdmin(idReserva);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Patch('medicos/:id_medico/valor-consulta')
    @HttpCode(HttpStatus.OK)
    async modificarValorConsulta(
        @Param('id_medico', ParseIntPipe) idMedico: number,
        @Body() updValorConsulta: UpdateValorConsultaDto,
    ): Promise<void>{
        return this.medicoS.modificarValorConsulta(idMedico, updValorConsulta.valor_consulta)
    }
}