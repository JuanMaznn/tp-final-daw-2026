import { Component, inject, OnInit, signal, WritableSignal } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MessageService } from "primeng/api";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";
import { DatePickerModule } from "primeng/datepicker";
import { Template } from "../../template/template";
import { AuthStore } from "../../auth/auth-store";
import { EstadosReservasEnum } from "../../paciente/turnos/estados-reservas-enum";
import { ListReservaDTO } from "../../paciente/turnos/listado/list-reserva-dto";
import { AgendaMedicoApiClient } from "./agenda-medico-api-client";

@Component({
    selector: "app-agenda-medico",
    templateUrl: "./agenda-medico.html",
    styleUrls: ["./agenda-medico.css"],
    imports: [TableModule, ButtonModule, TooltipModule, DatePickerModule, FormsModule, Template, DatePipe]
})
export class AgendaMedico implements OnInit {

    private readonly messageService: MessageService = inject(MessageService);

    private readonly agendaMedicoApiClient: AgendaMedicoApiClient = inject(AgendaMedicoApiClient);

    private readonly authStore: AuthStore = inject(AuthStore);

    readonly estados = EstadosReservasEnum;

    // Id del médico (tabla medicos). No es el mismo que el id del usuario.
    private idMedico: number | null = null;

    fecha: Date = new Date();

    turnos: WritableSignal<ListReservaDTO[]> = signal([]);

    ngOnInit(): void {
        // El token trae el id del usuario; con la lista de médicos se busca cuál es el suyo.
        const idUsuario: number | null = this.authStore.obtenerIdUsuario();
        this.agendaMedicoApiClient.buscarMedicos().subscribe({
            next: (medicos) => {
                this.idMedico = medicos.find((m) => m.idUsuario === idUsuario)?.id ?? null;
                this.refrescarTurnos();
            },
            error: () => {
                this.messageService.add({ severity: "error", summary: "Error", detail: "Error al obtener los datos del médico" });
            }
        });
    }

    // Formatea la fecha elegida como AAAA-MM-DD (lo que pide el back).
    private fechaComoTexto(): string {
        const pad = (n: number): string => String(n).padStart(2, "0");
        return `${this.fecha.getFullYear()}-${pad(this.fecha.getMonth() + 1)}-${pad(this.fecha.getDate())}`;
    }

    refrescarTurnos(): void {
        if (this.idMedico === null || !this.fecha) {
            return;
        }
        this.agendaMedicoApiClient.buscarTurnosPorFecha(this.idMedico, this.fechaComoTexto()).subscribe({
            next: (data) => {
                this.turnos.set(data);
            },
            error: () => {
                this.messageService.add({ severity: "error", summary: "Error", detail: "Error al obtener los turnos" });
            }
        });
    }

    marcar(turno: ListReservaDTO, estado: "ATENDIDO" | "AUSENTE"): void {
        this.agendaMedicoApiClient.cambiarEstado(turno.id, estado).subscribe({
            next: () => {
                this.messageService.add({ severity: "success", summary: "Éxito", detail: `Turno marcado como ${estado}.` });
                this.refrescarTurnos();
            },
            error: (err) => {
                let detail: string = "Ha ocurrido un error al cambiar el estado del turno";
                if (err.error?.statusCode >= 400 && err.error?.statusCode < 500) {
                    detail = Array.isArray(err.error.message) ? err.error.message.join(". ") : err.error.message;
                }
                this.messageService.add({ severity: "error", summary: "Error", detail: detail });
            }
        });
    }

}
