import { Body, Controller, Get, NotImplementedException, Param, ParseIntPipe, Patch, Query } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { UpdateEstadoReservaDto } from "../dtos/input/update-estado-reserva.dto.js";
import { ReservasService } from "../services/reservas.service.js";

@Controller("medicos")
export class MedicosController{
    constructor(private readonly reservaS: ReservasService){}

    @ApiBearerAuth()
    @Get(':id_medico/reserva')
    async obtenerReservaPorFecha(
        @Param('id_medico', ParseIntPipe) idMedico: number,
        @Query('fecha') fecha:string,
    ): Promise<any[]>{
        return this.reservaS.obtenerReservaPorFecha(idMedico, fecha)
    }

    @ApiBearerAuth()
    @Patch(':id_reserva/estado')
    async cambiarEstadoReserva(
        @Param('id_reserva', ParseIntPipe) idReserva: number,
        @Body() updEstado: UpdateEstadoReservaDto,
    ): Promise<any>{
        return this.reservaS.cambiarEstadoReserva(idReserva, updEstado.estado)
    }
}