import { Component, inject, model, ModelSignal, OnInit, signal, WritableSignal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from "primeng/button";
import { DatePickerModule } from "primeng/datepicker";
import { NgSelectModule } from "@ng-select/ng-select";
import { ListMedicoDTO } from "./list-medico-dto";
import { CreateReservaDTO } from "./create-reserva-dto";
import { ReservarTurnoApiClient } from "./reservar-turno-api-client";

@Component({
    selector: "app-reservar-turno",
    templateUrl: "./reservar-turno.html",
    styleUrls: ["./reservar-turno.css"],
    imports: [DialogModule, ButtonModule, DatePickerModule, NgSelectModule, ReactiveFormsModule]
})
export class ReservarTurno implements OnInit {

    // model() permite el binding de dos vías [(visible)] con el componente padre.
    visible: ModelSignal<boolean> = model(false);

    private readonly messageService: MessageService = inject(MessageService);

    private readonly reservarTurnoApiClient: ReservarTurnoApiClient = inject(ReservarTurnoApiClient);

    medicos: WritableSignal<ListMedicoDTO[]> = signal([]);

    // La regla de negocio dice: máximo 30 días de anticipación y nunca en el pasado.
    readonly fechaMinima: Date = new Date();

    readonly fechaMaxima: Date = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    readonly form: FormGroup = new FormGroup({
        medico: new FormControl<ListMedicoDTO | null>(null, [Validators.required]),
        fechaHora: new FormControl<Date | null>(null, [Validators.required])
    });

    ngOnInit(): void {
        this.reservarTurnoApiClient.buscarMedicos().subscribe({
            next: (data) => {
                this.medicos.set(data.map((m) => ({ ...m, nombreCompleto: `${m.apellidos}, ${m.nombres}` })));
            },
            error: () => {
                this.messageService.add({ severity: "error", summary: "Error", detail: "Error al obtener los médicos" });
            }
        });
    }

    cerrarDialog(): void {
        this.form.reset();
        this.visible.set(false);
    }

    guardarReserva(): void {
        if (!this.form.valid) {
            this.form.markAllAsTouched();
            this.messageService.add({ severity: "error", summary: "Error", detail: "Por favor, complete todos los campos requeridos." });
            return;
        }

        const medico: ListMedicoDTO = this.form.value.medico;
        const fecha: Date = this.form.value.fechaHora;

        // Se arma el texto SIN la "Z" final (ej. 2026-11-03T10:00:00) para que el back
        // lo tome como hora local de Argentina. Con "Z" se interpretaría como UTC.
        const pad = (n: number): string => String(n).padStart(2, "0");
        const fechaHora: string =
            `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())}` +
            `T${pad(fecha.getHours())}:${pad(fecha.getMinutes())}:00`;

        const dto: CreateReservaDTO = { id_medico: medico.id, fecha_hora: fechaHora };

        this.reservarTurnoApiClient.crearReserva(dto).subscribe({
            next: () => {
                this.messageService.add({ severity: "success", summary: "Éxito", detail: "Turno reservado correctamente." });
                this.cerrarDialog();
            },
            error: (err) => {
                let detail: string = "Ha ocurrido un error al reservar el turno";
                if (err.error?.statusCode >= 400 && err.error?.statusCode < 500) {
                    detail = Array.isArray(err.error.message) ? err.error.message.join(". ") : err.error.message;
                }
                this.messageService.add({ severity: "error", summary: "Error", detail: detail });
            }
        });
    }

}
