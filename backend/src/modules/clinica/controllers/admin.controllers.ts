import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { CreateReservaAdminDto } from "../dtos/input/create-reserva-admin.dto.js";
import { UpdateValorConsultaDto } from "../dtos/input/update-valor-consulta.dto.js";

@Controller('admin')
export class AdminController{
    @ApiBearerAuth()
    @Get('reserva')
    async listarReservas(
        @Query('fecha') fecha?: string,
        @Query('id_medico') idMedico?: number,
    ): Promise<any[]>{
        throw new Error('Método no implementado');
    }

    @ApiBearerAuth()
    @Post('reservas')
    @HttpCode(HttpStatus.CREATED)
    async reservarTurnoAdmin(
        @Body() createReservaAdmin: CreateReservaAdminDto
    ): Promise<any>{
        throw new Error('Método no implementado');
    }

    @ApiBearerAuth()
    @Patch('reservas/:id_reserva/cancelar')
    @HttpCode(HttpStatus.OK)
    async cancelarReservaAdmin(
        @Param('id_reserva', ParseIntPipe) idReserva: number,
    ): Promise<void>{
        throw new Error('Método no implementado');
    }

    @ApiBearerAuth()
    @Patch('medicos/:id_medico/valor-consulta')
    @HttpCode(HttpStatus.OK)
    async modificarValorConsulta(
        @Param('id_medico', ParseIntPipe) idMedico: number,
        @Body() updValorConsulta: UpdateValorConsultaDto,
    ): Promise<void>{
        throw new Error('Método no implementado');
    }
}