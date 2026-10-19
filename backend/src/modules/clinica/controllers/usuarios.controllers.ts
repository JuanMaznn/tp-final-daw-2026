import { Body, Controller, Get, NotImplementedException, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { ApiBearerAuth, ApiOkResponse } from "@nestjs/swagger";
import { ListReservaDTO } from "../dtos/output/list-reserva.dto.js";
import { CreateReservaDto } from "../dtos/input/create-reserva.dto.js";
import { ReservasService } from "../services/reservas.service.js";
import { AuthGuard } from "../../auth/guards/auth.guard.js";

@Controller('usuario')
export class UsuarioController{
    constructor(private readonly reservaS: ReservasService){

    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOkResponse({ type: ListReservaDTO, isArray: true })
    @Get(':id_usuario/reservas')
    async obtenerTurnoUsuario(
        @Param('id_usuario', ParseIntPipe) idUsuario: number, 
    ): Promise<ListReservaDTO[]>{
        return this.reservaS.obtenerTurnosUsuario(idUsuario);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Post()
    async crearReserva(
        @Body() createReservaDto: CreateReservaDto,
        @Req() request: Request & { usuario: { sub: number } },
    ): Promise<{ id: number }> {
        const idUsuario: number = request['usuario'].sub;
        return this.reservaS.crearReservaPaciente({
            idPaciente: idUsuario,
            idMedico: createReservaDto.id_medico,
            fechaHora: createReservaDto.fecha_hora
        })
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Patch(':id_reserva/cancelar')
    async cancelarReserva(
        @Param('id_reserva', ParseIntPipe) idReserva: number,
        @Req() request: Request & { usuario: { sub: number } },
    ): Promise<void>{
        const idUsuario: number = request['usuario'].sub;
        return this.reservaS.cancelarReservaPaciente(idReserva, idUsuario)
    }

    
}