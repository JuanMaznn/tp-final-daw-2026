import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsInt, IsNotEmpty } from "class-validator";

export class CreateReservaAdminDto {

    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    id_medico: number;

    @IsInt()
    @IsNotEmpty()
    id_paciente: number;

    @IsDateString()
    @IsNotEmpty()
    fecha_hora: string;
}