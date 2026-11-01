import { Component, effect, inject, OnInit, signal, WritableSignal } from "@angular/core";
import { DatePipe, CurrencyPipe } from "@angular/common";
import { MessageService } from "primeng/api";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";
import { Template } from "../../../template/template";
import { AuthStore } from "../../../auth/auth-store";
import { EstadosReservasEnum } from "../estados-reservas-enum";
import { ReservarTurno } from "../gestion/reservar-turno";
import { ListReservaDTO } from "./list-reserva-dto";
import { TurnosListadoApiClient } from "./turnos-listado-api-client";

@Component({
    selector: "app-turnos-listado",
    templateUrl: "./turnos-listado.html",
    styleUrls: ["./turnos-listado.css"],
    imports: [TableModule, ButtonModule, TooltipModule, Template, ReservarTurno, DatePipe, CurrencyPipe]
})
export class TurnosListado implements OnInit {

    private readonly messageService: MessageService = inject(MessageService);

    private readonly turnosListadoApiClient: TurnosListadoApiClient = inject(TurnosListadoApiClient);

    private readonly authStore: AuthStore = inject(AuthStore);

    readonly estados = EstadosReservasEnum;

    turnos: WritableSignal<ListReservaDTO[]> = signal([]);

    dialogVisible: WritableSignal<boolean> = signal(false);

    constructor() {
        // Cada vez que se cierra el diálogo de reservar, se vuelve a pedir la lista.
        effect(() => {
            if (!this.dialogVisible()) {
                this.refrescarTurnos();
            }
        });
    }

    ngOnInit(): void {
        this.refrescarTurnos();
    }

    refrescarTurnos(): void {
        const idUsuario: number | null = this.authStore.obtenerIdUsuario();
        if (idUsuario === null) {
            return;
        }
        this.turnosListadoApiClient.buscarTurnos(idUsuario).subscribe({
            next: (data) => {
                this.turnos.set(data);
            },
            error: () => {
                this.messageService.add({ severity: "error", summary: "Error", detail: "Error al obtener los turnos" });
            }
        });
    }

    reservarTurno(): void {
        this.dialogVisible.set(true);
    }

    cancelarTurno(turno: ListReservaDTO): void {
        this.turnosListadoApiClient.cancelarTurno(turno.id).subscribe({
            next: () => {
                this.messageService.add({ severity: "success", summary: "Éxito", detail: "Turno cancelado correctamente." });
                this.refrescarTurnos();
            },
            error: (err) => {
                let detail: string = "Ha ocurrido un error al cancelar el turno";
                if (err.error?.statusCode >= 400 && err.error?.statusCode < 500) {
                    detail = err.error.message;
                }
                this.messageService.add({ severity: "error", summary: "Error", detail: detail });
            }
        });
    }

}
