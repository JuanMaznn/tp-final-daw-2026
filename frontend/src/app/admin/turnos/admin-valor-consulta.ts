import { Component, inject, model, ModelSignal, OnInit, signal, WritableSignal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from "primeng/button";
import { InputNumberModule } from "primeng/inputnumber";
import { NgSelectModule } from "@ng-select/ng-select";
import { ListMedicoDTO } from "../../paciente/turnos/gestion/list-medico-dto";
import { AdminApiClient } from "./admin-api-client";

@Component({
    selector: "app-admin-valor-consulta",
    templateUrl: "./admin-valor-consulta.html",
    styleUrls: ["./admin-valor-consulta.css"],
    imports: [DialogModule, ButtonModule, InputNumberModule, NgSelectModule, ReactiveFormsModule]
})
export class AdminValorConsulta implements OnInit {

    visible: ModelSignal<boolean> = model(false);

    private readonly messageService: MessageService = inject(MessageService);

    private readonly adminApiClient: AdminApiClient = inject(AdminApiClient);

    medicos: WritableSignal<ListMedicoDTO[]> = signal([]);

    readonly form: FormGroup = new FormGroup({
        medico: new FormControl<ListMedicoDTO | null>(null, [Validators.required]),
        valorConsulta: new FormControl<number | null>(null, [Validators.required, Validators.min(0)])
    });

    ngOnInit(): void {
        this.cargarMedicos();
    }

    // Se vuelve a pedir la lista cada vez que se guarda, para mostrar el valor actual.
    private cargarMedicos(): void {
        this.adminApiClient.buscarMedicos().subscribe({
            next: (data) => {
                this.medicos.set(data.map((m) => ({ ...m, nombreCompleto: `${m.apellidos}, ${m.nombres} (actual: $${m.valorConsulta})` })));
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

    guardarValor(): void {
        if (!this.form.valid) {
            this.form.markAllAsTouched();
            this.messageService.add({ severity: "error", summary: "Error", detail: "Por favor, complete todos los campos requeridos." });
            return;
        }

        const medico: ListMedicoDTO = this.form.value.medico;
        const valor: number = this.form.value.valorConsulta;

        this.adminApiClient.modificarValorConsulta(medico.id, valor).subscribe({
            next: () => {
                this.messageService.add({ severity: "success", summary: "Éxito", detail: "Valor de la consulta actualizado." });
                this.cargarMedicos();
                this.cerrarDialog();
            },
            error: (err) => {
                let detail: string = "Ha ocurrido un error al modificar el valor de la consulta";
                if (err.error?.statusCode >= 400 && err.error?.statusCode < 500) {
                    detail = Array.isArray(err.error.message) ? err.error.message.join(". ") : err.error.message;
                }
                this.messageService.add({ severity: "error", summary: "Error", detail: detail });
            }
        });
    }

}
