import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsInt, IsNotEmpty } from "class-validator";

export class CreateReservaDto{
  @ApiProperty()  
  @IsInt()
  @IsNotEmpty({ message: 'El id_medico es obligatorio' })
  id_medico: number;

  @ApiProperty()
  @IsDateString({}, { message: '' })
  @IsNotEmpty({ message: 'La fecha_hora es obligatoria' })
  fecha_hora: string;
}