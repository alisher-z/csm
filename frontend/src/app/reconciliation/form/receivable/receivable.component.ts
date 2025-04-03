import { formatDate } from '@angular/common';
import { Component, effect, EventEmitter, inject, Input, Output, signal, WritableSignal } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextboxComponent } from "../../../components/textbox/textbox.component";
import { WipeDirective } from '../../../components/utils/wipe.directive';
import { ReconciliationService } from '../../reconciliation.service';

@Component({
  selector: 'form-receivable',
  imports: [ReactiveFormsModule, FormsModule, TextboxComponent],
  templateUrl: './receivable.component.html',
  styleUrl: './receivable.component.scss'
})
export class ReceivableFormComponent extends WipeDirective {
  @Input() form!: FormGroup;
  @Output() select = new EventEmitter();

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
      received: new FormControl(0, Validators.min(1)),
      balance: new FormControl({ value: 0, disabled: true })
    });

    this.listen(form);
    return form;
  }

  listen(form: FormGroup) {
    const include = form.get('include')!
      .valueChanges
      .subscribe(() => this.select.emit());

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
    })
  }

  get receivables() {
    return this.form.get('receivables') as FormArray;
  }
  get receipts() {
    return this.service.unclearedReceipts.value();
  }
}
