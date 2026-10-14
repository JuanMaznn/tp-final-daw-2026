import { Body, Controller, Get, NotImplementedException, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { CreateReservaDto } from "../dtos/input/create-reserva.dto.js";
import { ReservasService } from "../services/reservas.service.js";

@Controller('usuario')
export class UsuarioController{
    constructor(private readonly reservaS: ReservasService){

    }

    @ApiBearerAuth()
    @Get(':id_usuario/reservas')
    async obtenerTurnoUsuario(
        @Param('id_usuario', ParseIntPipe) idUsuario: number, 
    ): Promise<any[]>{
        return this.reservaS.obtenerTurnosUsuario(idUsuario);
    }

    @ApiBearerAuth()
    @Post()
    async crearReserva(@Body() createReservaDto: CreateReservaDto){
        const idUsuario = 1;
        return this.reservaS.crearReservaPaciente({
            idPaciente: idUsuario,
            idMedico: createReservaDto.id_medico,
            fechaHora: createReservaDto.fecha_hora
        })
    }

    @ApiBearerAuth()
    @Patch(':id_reserva/cancelar')
    async cancelarReserva(
        @Param('id_reserva', ParseIntPipe) idReserva: number,
    ): Promise<any>{
        const idUsuario = 1;
        return this.reservaS.cancelarReservaPaciente(idReserva, idUsuario)
    }

    
}