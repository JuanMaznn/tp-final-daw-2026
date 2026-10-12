// create-medico.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateMedicoDto {

  @ApiProperty()  
  @IsInt({ message: 'El ID de usuario debe ser un número entero' })
  @IsPositive({ message: 'El ID de usuario debe ser válido' })
  @IsNotEmpty({ message: 'El id_usuario es obligatorio' })
  id_usuario: number;

  @ApiProperty()
  @IsInt({ message: 'La matrícula debe ser un número entero' })
  @IsNotEmpty({ message: 'La matrícula es obligatoria' })
  matricula: number;

  @ApiProperty()
  @IsInt({ message: 'El valor de la consulta debe ser un número entero' })
  @IsPositive({ message: 'El valor de la consulta debe ser mayor a cero' })
  @IsNotEmpty({ message: 'El valor de la consulta es obligatorio' })
  valor_consulta: number;
}