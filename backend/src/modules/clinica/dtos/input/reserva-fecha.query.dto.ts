import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty } from "class-validator";

export class ReservaFechaQueryDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'La fecha es obligatoria' })
    @IsDateString({}, { message: 'La fecha debe tener formato AAAA-MM-DD' })
    fecha!: string;
}
