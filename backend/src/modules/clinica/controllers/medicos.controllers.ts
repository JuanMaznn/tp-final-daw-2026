import { Body, Controller, Get, NotImplementedException, Param, ParseIntPipe, Patch, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse } from "@nestjs/swagger";
import { ListReservaDTO } from "../dtos/output/list-reserva.dto.js";
import { UpdateEstadoReservaDto } from "../dtos/input/update-estado-reserva.dto.js";
import { ReservaFechaQueryDto } from "../dtos/input/reserva-fecha.query.dto.js";
import { ReservasService } from "../services/reservas.service.js";
import { AuthGuard } from "../../auth/guards/auth.guard.js";

@Controller("medicos")
export class MedicosController{
    constructor(private readonly reservaS: ReservasService){}

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOkResponse({ type: ListReservaDTO, isArray: true })
    @Get(':id_medico/reserva')
    async obtenerReservaPorFecha(
        @Param('id_medico', ParseIntPipe) idMedico: number,
        @Query() query: ReservaFechaQueryDto,
    ): Promise<ListReservaDTO[]>{
        return this.reservaS.obtenerReservaPorFecha(idMedico, query.fecha)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Patch(':id_reserva/estado')
    async cambiarEstadoReserva(
        @Param('id_reserva', ParseIntPipe) idReserva: number,
        @Body() updEstado: UpdateEstadoReservaDto,
    ): Promise<void>{
        return this.reservaS.cambiarEstadoReserva(idReserva, updEstado.estado)
    }
}