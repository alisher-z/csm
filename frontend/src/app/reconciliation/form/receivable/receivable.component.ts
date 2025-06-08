import { Component, effect, EventEmitter, inject, input, Output, WritableSignal } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextboxComponent } from "../../../components/textbox/textbox.component";
import { NumberboxComponent } from "../../../components/numberbox/numberbox.component";
import { ChangeRowsFormDirective } from '../../../salesreceipt/form/form.directive';
import { ReceivableDirective } from './receivable.directive';
import { CheckboxComponent } from "../../../components/checkbox/checkbox.component";
import { ReconciliationTotalComponent } from "./total/total.component";
import { ReconciliationTableFooterDirective } from './table-footer/table-footer.directive';
import { ReceivableFormService } from './receivable.service';
import { ReconciliationFormService } from '../form.service';
import { ReconciliationService } from '../../reconciliation.service';

@Component({
  selector: 'form-receivable',
  imports: [ReactiveFormsModule, FormsModule, TextboxComponent, NumberboxComponent, ChangeRowsFormDirective, CheckboxComponent, ReconciliationTableFooterDirective],
  templateUrl: './receivable.component.html',
  styleUrl: './receivable.component.scss'
})
export class ReceivableFormComponent {
  @Output() selected = new EventEmitter();
  @Output() totalE = new EventEmitter<number>();

  reconciliationFormService = inject(ReconciliationFormService);
  receivableFormService = inject(ReceivableFormService);

  receipts: WritableSignal<any[] | undefined>;
  indeterminate: WritableSignal<boolean>;
  indeterminates: boolean[];
  receivables: FormArray;

  get form() {
    return this.reconciliationFormService.form;
  }

  constructor() {
    this.receivableFormService.receivables = this.form.get('receivables') as FormArray;
    this.receivables = this.form.get('receivables') as FormArray;
    this.receipts = this.reconciliationFormService.service.unclearedReceipts.value;
    this.indeterminate = this.reconciliationFormService.indeterminate;
    this.indeterminates = this.reconciliationFormService.indeterminates;

    effect(() => this.init());
  }

  init() {
    const receipts = this.receipts()
    if (!receipts) return;

    this.receivableFormService.setForm(receipts);
    this.reconciliationFormService.setIndeterminates(receipts);
  }

  select(form: AbstractControl) {
    const { received } = (<FormGroup>form).controls;
    const { include, due } = form.getRawValue();

    this.reconciliationFormService.setValue(received, include ? due : 0);
    this.selected.emit(false);
  }
  selectAll(value: boolean) {
    const controls = this.receivableFormService.receivables.controls as FormGroup[];

    if (!value)
      this.resetReceivables(controls);
    else
      controls.forEach((form) =>
        this.reconciliationFormService.patchValue(form, {
          include: true,
          received: form.get('due')?.value
        }));

    this.selected.emit(true);
  }

  onTotalReceived(value: number) {
    value = +value;

    const controls = this.receivableFormService.receivables.controls as FormGroup[];

    this.resetReceivables(controls);
    this.resetIndeterminates();
    this.setReceivableAmounts(controls, value);
  }

  resetReceivables(controls: FormGroup[]) {
    controls.forEach((form) =>
      this.reconciliationFormService.patchValue(form, {
        include: false,
        received: 0
      }));
  }

  setReceivableAmounts(controls: FormGroup[], value: number) {
    this.totalE.emit(value);

    if (value <= 0) return;

    for (const [index, form] of controls.entries()) {
      const due = +form.get('due')?.value;

      this.reconciliationFormService.patchValue(form, {
        include: value < due ? false : true,
        received: value <= due ? value : due
      });

      if (value < due)
        this.reconciliationFormService.indeterminates[index] = true;

      if (value <= due)
        break;

      value -= due;
    }
  }

  resetIndeterminates() {
    for (let i = 0; i < this.reconciliationFormService.indeterminates.length; i++)
      this.reconciliationFormService.indeterminates[i] = false;
  }
}
