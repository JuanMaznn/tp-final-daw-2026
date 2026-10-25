import { ApiProperty } from "@nestjs/swagger";

export class ListMedicoDTO {
    @ApiProperty()
    id!: number;

    @ApiProperty()
    idUsuario!: number;

    @ApiProperty()
    matricula!: number;

    @ApiProperty()
    valorConsulta!: number;

    @ApiProperty()
    nombres!: string;

    @ApiProperty()
    apellidos!: string;
}
