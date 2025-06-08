import { inject, Injectable, signal } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { ReconciliationService } from '../reconciliation.service';

@Injectable({
  providedIn: 'root'
})
export class ReconciliationFormService {
  service = inject(ReconciliationService);

  form!: FormGroup;
  indeterminate = signal(false);
  indeterminates!: boolean[];

  setIndeterminates(receipts: any[]) {
    this.indeterminates = new Array<boolean>(receipts.length).fill(false);
  }

  resetReceivables() {
    this.receivableForms.forEach(form => {
      const value = {
        include: false,
        received: 0
      };

      this.patchValue(form, value);
    });
  }

  resetIndeterminates() {
    for (let i = 0; i < this.indeterminates.length; i++)
      this.indeterminates[i] = false;
  }

  patchValue(form: FormGroup, value: any, event = false) {
    form.patchValue(value, { emitEvent: event });
  }

  setValue(c: AbstractControl, v: any, e = false) {
    c.setValue(v, { emitEvent: e });
  }

  get receivables() {
    return this.form.get('receivables') as FormArray;
  }
  get receivableForms() {
    return this.receivables.controls as FormGroup[];
  }
}
