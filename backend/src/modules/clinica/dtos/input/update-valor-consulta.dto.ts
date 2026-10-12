
import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";

export class UpdateValorConsultaDto{
    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    valor_consulta: number;
}