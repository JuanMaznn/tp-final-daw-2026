import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse } from "@nestjs/swagger";
import { ListReservaDTO } from "../dtos/output/list-reserva.dto.js";
import { AuthGuard } from "../../auth/guards/auth.guard.js";
import { RolesGuard } from "../../auth/guards/roles.guard.js";
import { Roles } from "../../auth/decorators/roles.decorator.js";
import { RolesUsuariosEnum } from "../../auth/enums/roles-usuarios.enum.js";
import { CreateReservaAdminDto } from "../dtos/input/create-reserva-admin.dto.js";
import { UpdateValorConsultaDto } from "../dtos/input/update-valor-consulta.dto.js";
import { ReservasService } from "../services/reservas.service.js";
import { AdminService } from "../services/admin.service.js";
import { ListPacienteDTO } from "../dtos/output/list-paciente.dto.js";
import { MedicoService } from "../services/medicos.service.js";

@Controller('admin')
export class AdminController{
    constructor(
        private readonly reservaS: ReservasService,
        private readonly medicoS: MedicoService,
        private readonly adminS: AdminService
    ){

    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RolesUsuariosEnum.ADMINSTRADOR)
    @ApiOkResponse({ type: ListPacienteDTO, isArray: true })
    @Get('pacientes')
    async listarPacientes(): Promise<ListPacienteDTO[]>{
        return this.adminS.listarPacientes();
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RolesUsuariosEnum.ADMINSTRADOR)
    @ApiOkResponse({ type: ListReservaDTO, isArray: true })
    @Get('reserva')
    async listarReservas(
        @Query('fecha') fecha?: string,
        @Query('id_medico', new ParseIntPipe({ optional: true})) idMedico?: number,
        @Query('id_paciente', new ParseIntPipe({ optional: true})) idPaciente?: number,
    ): Promise<ListReservaDTO[]>{
        return this.reservaS.listarReservasAdmin(fecha, idMedico, idPaciente)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RolesUsuariosEnum.ADMINSTRADOR)
    @Post('reservas')
    @HttpCode(HttpStatus.CREATED)
    async reservarTurnoAdmin(
        @Body() dto: CreateReservaAdminDto
    ): Promise<{ id: number }>{
        return this.reservaS.reservarTurnoAdmin(dto)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RolesUsuariosEnum.ADMINSTRADOR)
    @Patch('reservas/:id_reserva/cancelar')
    @HttpCode(HttpStatus.OK)
    async cancelarReservaAdmin(
        @Param('id_reserva', ParseIntPipe) idReserva: number,
    ): Promise<void>{
        return this.reservaS.cancelarReservaAdmin(idReserva);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RolesUsuariosEnum.ADMINSTRADOR)
    @Patch('medicos/:id_medico/valor-consulta')
    @HttpCode(HttpStatus.OK)
    async modificarValorConsulta(
        @Param('id_medico', ParseIntPipe) idMedico: number,
        @Body() updValorConsulta: UpdateValorConsultaDto,
    ): Promise<void>{
        return this.medicoS.modificarValorConsulta(idMedico, updValorConsulta.valor_consulta)
    }
}