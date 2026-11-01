import { Component, effect, inject, OnInit, signal, WritableSignal } from "@angular/core";
import { DatePipe, CurrencyPipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MessageService } from "primeng/api";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";
import { DatePickerModule } from "primeng/datepicker";
import { NgSelectModule } from "@ng-select/ng-select";
import { Template } from "../../template/template";
import { EstadosReservasEnum } from "../../paciente/turnos/estados-reservas-enum";
import { ListReservaDTO } from "../../paciente/turnos/listado/list-reserva-dto";
import { ListMedicoDTO } from "../../paciente/turnos/gestion/list-medico-dto";
import { ListPacienteDTO } from "./list-paciente-dto";
import { AdminApiClient } from "./admin-api-client";
import { AdminReservarTurno } from "./admin-reservar-turno";
import { AdminValorConsulta } from "./admin-valor-consulta";

@Component({
    selector: "app-admin-turnos",
    templateUrl: "./admin-turnos.html",
    styleUrls: ["./admin-turnos.css"],
    imports: [
        TableModule, ButtonModule, TooltipModule, DatePickerModule, NgSelectModule, FormsModule,
        Template, AdminReservarTurno, AdminValorConsulta, DatePipe, CurrencyPipe
    ]
})
export class AdminTurnos implements OnInit {

    private readonly messageService: MessageService = inject(MessageService);

    private readonly adminApiClient: AdminApiClient = inject(AdminApiClient);

    readonly estados = EstadosReservasEnum;

    turnos: WritableSignal<ListReservaDTO[]> = signal([]);

    medicos: WritableSignal<ListMedicoDTO[]> = signal([]);

    pacientes: WritableSignal<ListPacienteDTO[]> = signal([]);

    // Filtros (todos opcionales).
    fechaFiltro: Date | null = null;

    medicoFiltro: ListMedicoDTO | null = null;

    pacienteFiltro: ListPacienteDTO | null = null;

    reservarVisible: WritableSignal<boolean> = signal(false);

    valorVisible: WritableSignal<boolean> = signal(false);

    constructor() {
        // Cuando se cierra cualquiera de los dos diálogos se vuelve a pedir la lista.
        effect(() => {
            if (!this.reservarVisible() && !this.valorVisible()) {
                this.refrescarTurnos();
            }
        });
    }

    ngOnInit(): void {
        this.adminApiClient.buscarMedicos().subscribe({
            next: (data) => {
                this.medicos.set(data.map((m) => ({ ...m, nombreCompleto: `${m.apellidos}, ${m.nombres}` })));
            },
            error: () => {
                this.messageService.add({ severity: "error", summary: "Error", detail: "Error al obtener los médicos" });
            }
        });
        this.adminApiClient.buscarPacientes().subscribe({
            next: (data) => {
                this.pacientes.set(data.map((p) => ({ ...p, nombreCompleto: `${p.apellidos}, ${p.nombres} (${p.documento})` })));
            },
            error: () => {
                this.messageService.add({ severity: "error", summary: "Error", detail: "Error al obtener los pacientes" });
            }
        });
        this.refrescarTurnos();
    }

    // Formatea la fecha elegida como AAAA-MM-DD (lo que pide el back).
    private fechaComoTexto(fecha: Date): string {
        const pad = (n: number): string => String(n).padStart(2, "0");
        return `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())}`;
    }

    refrescarTurnos(): void {
        const fecha: string | undefined = this.fechaFiltro ? this.fechaComoTexto(this.fechaFiltro) : undefined;
        const idMedico: number | undefined = this.medicoFiltro?.id;
        const idPaciente: number | undefined = this.pacienteFiltro?.id;
        this.adminApiClient.buscarTurnos(fecha, idMedico, idPaciente).subscribe({
            next: (data) => {
                this.turnos.set(data);
            },
            error: () => {
                this.messageService.add({ severity: "error", summary: "Error", detail: "Error al obtener los turnos" });
            }
        });
    }

    reservarTurno(): void {
        this.reservarVisible.set(true);
    }

    modificarValor(): void {
        this.valorVisible.set(true);
    }

    cancelarTurno(turno: ListReservaDTO): void {
        this.adminApiClient.cancelarTurno(turno.id).subscribe({
            next: () => {
                this.messageService.add({ severity: "success", summary: "Éxito", detail: "Turno cancelado correctamente." });
                this.refrescarTurnos();
            },
            error: (err) => {
                let detail: string = "Ha ocurrido un error al cancelar el turno";
                if (err.error?.statusCode >= 400 && err.error?.statusCode < 500) {
                    detail = Array.isArray(err.error.message) ? err.error.message.join(". ") : err.error.message;
                }
                this.messageService.add({ severity: "error", summary: "Error", detail: detail });
            }
        });
    }

}
