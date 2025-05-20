import { formatDate } from '@angular/common';
import { Component, effect, EventEmitter, inject, Input, Output, signal, WritableSignal } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextboxComponent } from "../../../components/textbox/textbox.component";
import { WipeDirective } from '../../../components/utils/wipe.directive';
import { ReconciliationService } from '../../reconciliation.service';
import { NumberboxComponent } from "../../../components/numberbox/numberbox.component";
import { ChangeRowsFormDirective } from '../../../salesreceipt/form/form.directive';

@Component({
  selector: 'form-receivable',
  imports: [ReactiveFormsModule, FormsModule, TextboxComponent, NumberboxComponent, ChangeRowsFormDirective],
  templateUrl: './receivable.component.html',
  styleUrl: './receivable.component.scss'
})
export class ReceivableFormComponent extends WipeDirective {
  @Input() form!: FormGroup;
  @Output() pick = new EventEmitter();

  service = inject(ReconciliationService);

  constructor() {
    super();
    effect(() =>
      this.receipts
        ? this.setForm(this.receipts)
        : null);
  }

  getForm() {
    const form = new FormGroup({
      include: new FormControl(false),
      receipt: new FormControl({ value: null, disabled: true }, Validators.required),
      date: new FormControl({ value: null, disabled: true }),
      due: new FormControl({ value: 0, disabled: true }),
      received: new FormControl({ value: 0, disabled: true }, Validators.min(1))
    });

    this.listen(form);
    return form;
  }

  listen(form: FormGroup) {
    const include = form.get('include')!
      .valueChanges
      .subscribe((v) => {
        console.log('hello world')
        this.pick.emit(v)
      });

    this.subscriptions.push(include);
  }

  setForm(receipts: any[]) {
    this.receivables.clear();
    receipts.forEach(r => {
      const form = this.getForm();
      const { receipt, date, due } = form.controls;

      receipt.setValue(r.id);
      date.setValue(formatDate(r.date, 'MMM d, yyyy', 'en') as any);
      due.setValue(r.amounts.due);

      this.receivables.push(form);
    });

    this.setTotal();
  }

  setTotal() {
    const values: any[] = this.receivables.getRawValue();
    const due = this.form.get('total')!.get('due')!;

    const sum = values.reduce((sum, { due }) => sum + +due, 0);

    due.setValue(sum, { emitEvent: false });
  }

  get receivables() {
    return this.form.get('receivables') as FormArray;
  }
  get receipts() {
    return this.service.unclearedReceipts.value();
  }
}
