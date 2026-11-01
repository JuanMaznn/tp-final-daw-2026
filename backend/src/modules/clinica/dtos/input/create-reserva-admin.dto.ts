import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsInt, IsNotEmpty } from "class-validator";

export class CreateReservaAdminDto {

    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    id_medico: number;

    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    id_paciente: number;

    @ApiProperty()
    @IsDateString()
    @IsNotEmpty()
    fecha_hora: string;
}