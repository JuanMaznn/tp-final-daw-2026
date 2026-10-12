import { Body, Controller, Get, NotImplementedException, Param, ParseIntPipe, Patch, Query } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { UpdateEstadoReservaDto } from "../dtos/input/update-estado-reserva.dto.js";

@Controller("medicos")
export class MedicosController{
    constructor(){

    }

    @ApiBearerAuth()
    @Get(':id_medico/reserva')
    async obtenerReservaPorFecha(
        @Param('id_medico', ParseIntPipe) idMedico: number,
        @Query('fecha') fecha:string,
    ): Promise<any[]>{
        throw new NotImplementedException();
    }

    @ApiBearerAuth()
    @Patch(':id_reserva/estado')
    async cambiarEstadoReserva(
        @Param('id_reserva', ParseIntPipe) idReserva: number,
        @Body() updEstado: UpdateEstadoReservaDto,
    ): Promise<any>{
        throw new NotImplementedException();
    }
}