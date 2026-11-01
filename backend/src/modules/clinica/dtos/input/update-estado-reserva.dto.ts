import { IsIn, IsNotEmpty } from "class-validator";
import { EstadosReservasEnum } from "../../enums/estados-reservas.enum.js";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateEstadoReservaDto{
    @ApiProperty({ enum: [EstadosReservasEnum.ATENDIDO, EstadosReservasEnum.AUSENTE] })
    @IsNotEmpty({ message: "Estado no puede estar vacio"})
    @IsIn([EstadosReservasEnum.ATENDIDO, EstadosReservasEnum.AUSENTE], {
        message: 'El médico solo puede marcar el turno como ATENDIDO o AUSENTE',
    })
    estado: EstadosReservasEnum;
}