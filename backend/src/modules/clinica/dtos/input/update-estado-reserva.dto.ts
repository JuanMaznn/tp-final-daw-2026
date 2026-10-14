import { IsEnum, IsNotEmpty } from "class-validator";
import { EstadosReservasEnum } from "../../enums/estados-reservas.enum.js";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateEstadoReservaDto{
    @ApiProperty()
    @IsNotEmpty({ message: "Estado no puede estar vacio"})
    @IsEnum( EstadosReservasEnum, {
        message: 'El estado si o si debe ser: Activo, atendido, ausente o cancelado'
    })
    estado: EstadosReservasEnum;
}