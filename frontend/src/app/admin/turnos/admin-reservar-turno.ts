import { Component, inject, model, ModelSignal, OnInit, signal, WritableSignal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from "primeng/button";
import { DatePickerModule } from "primeng/datepicker";
import { NgSelectModule } from "@ng-select/ng-select";
import { ListMedicoDTO } from "../../paciente/turnos/gestion/list-medico-dto";
import { ListPacienteDTO } from "./list-paciente-dto";
import { CreateReservaAdminDTO } from "./create-reserva-admin-dto";
import { AdminApiClient } from "./admin-api-client";

@Component({
    selector: "app-admin-reservar-turno",
    templateUrl: "./admin-reservar-turno.html",
    styleUrls: ["./admin-reservar-turno.css"],
    imports: [DialogModule, ButtonModule, DatePickerModule, NgSelectModule, ReactiveFormsModule]
})
export class AdminReservarTurno implements OnInit {

    visible: ModelSignal<boolean> = model(false);

    private readonly messageService: MessageService = inject(MessageService);

    private readonly adminApiClient: AdminApiClient = inject(AdminApiClient);

    medicos: WritableSignal<ListMedicoDTO[]> = signal([]);

    pacientes: WritableSignal<ListPacienteDTO[]> = signal([]);

    // Mismas reglas que para el paciente: máximo 30 días de anticipación y nunca en el pasado.
    readonly fechaMinima: Date = new Date();

    readonly fechaMaxima: Date = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    readonly form: FormGroup = new FormGroup({
        paciente: new FormControl<ListPacienteDTO | null>(null, [Validators.required]),
        medico: new FormControl<ListMedicoDTO | null>(null, [Validators.required]),
        fechaHora: new FormControl<Date | null>(null, [Validators.required])
    });

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

        const paciente: ListPacienteDTO = this.form.value.paciente;
        const medico: ListMedicoDTO = this.form.value.medico;
        const fecha: Date = this.form.value.fechaHora;

        // Sin la "Z" final, para que el back lo tome como hora local de Argentina.
        const pad = (n: number): string => String(n).padStart(2, "0");
        const fechaHora: string =
            `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())}` +
            `T${pad(fecha.getHours())}:${pad(fecha.getMinutes())}:00`;

        const dto: CreateReservaAdminDTO = { id_medico: medico.id, id_paciente: paciente.id, fecha_hora: fechaHora };

        this.adminApiClient.crearReserva(dto).subscribe({
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
