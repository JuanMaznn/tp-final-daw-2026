import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class LoginDTO{

    @ApiProperty()
    @IsString()
    @IsNotEmpty({message: "Nombre no puede estar vacio"})
    nombre: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    clave: string
}