import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ReceivableFormService {
  receivables!: FormArray;

  constructor() { }

  setForm(receipts: any[]) {
    this.resetReceivables();
    this.setFormValue(receipts);
  }

  private setFormValue(receipts: any[]) {
    for (const receipt of receipts) {
      const _form = this.form;

      _form.patchValue({
        receipt: receipt.id,
        date: this.toDate(receipt.date),
        due: receipt.amounts.due
      }, { emitEvent: false });

      this.receivables.push(_form);
    }
  }

  private resetReceivables() {
    this.receivables.clear();
  }
  private toDate(date: string) {
    return formatDate(date, 'MMM d, yyyy', 'en');
  }

  private get form() {
    const form = new FormGroup({
      include: new FormControl(false),
      receipt: new FormControl({ value: null, disabled: true }, Validators.required),
      date: new FormControl<string | null>({ value: null, disabled: true }),
      due: new FormControl({ value: 0, disabled: true }),
      received: new FormControl({ value: 0, disabled: true }, Validators.min(1))
    });

    return form;
  }
}
