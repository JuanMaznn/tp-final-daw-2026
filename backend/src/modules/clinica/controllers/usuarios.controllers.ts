import { Body, Controller, Get, NotImplementedException, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { CreateReservaDto } from "../dtos/input/create-reserva.dto.js";

@Controller('usuario')
export class UsuarioController{
    constructor(){

    }

    @ApiBearerAuth()
    @Get(':id_usuario/reservas')
    async obtenerTurnoUsuario(
        @Param('id_usuario', ParseIntPipe) idUsuario: number, 
    ): Promise<any[]>{
        throw new NotImplementedException();
    }

    @ApiBearerAuth()
    @Post()
    async crearReserva(@Body() createReservaDto: CreateReservaDto){
        throw new NotImplementedException();
    }

    @ApiBearerAuth()
    @Patch(':id_reserva/cancelar')
    async cancelarReserva(
        @Param('id_reserva', ParseIntPipe) idReserva: number,
    ): Promise<any>{
        throw new NotImplementedException();
    }
}