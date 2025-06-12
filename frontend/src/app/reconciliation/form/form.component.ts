import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MainFormComponent } from "../../components/form/form.component";
import { MyDateComponent } from "../../components/my-date/my-date.component";
import { RichtextComponent } from "../../components/richtext/richtext.component";
import { ComboboxComponent } from "../../components/combobox/combobox.component";
import { ReceivableFormComponent } from "./receivable/receivable.component";
import { ReconciliationFormDirective } from './form.directive';
import { ReconciliationFormTotal } from './base/reconciliation-total';

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule, MainFormComponent, MyDateComponent, RichtextComponent, ComboboxComponent, ReceivableFormComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class ReconciliationFormComponent extends ReconciliationFormDirective {
  // reconciliationFormService = inject(ReconciliationFormService);

  constructor() {
    super();
    // this.reconciliationFormService.form = this.form;
    // effect(() => console.log(this.service.unclearedReceipts.value()))
  }
}
