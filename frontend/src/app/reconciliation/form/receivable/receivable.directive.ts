import { Directive, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { FormUtilsDirective } from '../../../components/utils/form-utils.directive';

@Directive({
  selector: '[appReceivable]'
})
export abstract class ReceivableDirective extends FormUtilsDirective {
  indeterminate = signal(false);
  indeterminates = signal<boolean[]>([]);

  createForm(receipts: any[]) {
    this.clearRececeivables();
    this.setFormsValues(receipts);
  }

  createIndeterminates(list: any[]) {
    const indeterminates = new Array<boolean>(list.length).fill(false);
    this.indeterminates.set(indeterminates);
  }

  resetReceivables() {
    for (const form of this.receivableForms)
      this.patchForm({
        include: false,
        received: 0
      }, form);
  }

  resetIndeterminates() {
    this.createIndeterminates(this.indeterminates());
  }

  private clearRececeivables() {
    this.receivables.clear();
  }

  private setFormsValues(receipts: any[]) {
    for (const receipt of receipts)
      this.setFormValues(receipt);
  }

  private setFormValues(receipt: any) {
    const form = this.getForm();
    const values = {
      receipt: receipt.id,
      date: this.toDate(receipt.date),
      due: receipt.amounts.due
    };
    this.patchForm(values, form);

    this.receivables.push(form);
  }

  private getForm() {
    const form = new FormGroup({
      include: new FormControl(false),

      receipt: new FormControl({
        value: null,
        disabled: true
      },
        Validators.required),

      date: new FormControl<string | null>({
        value: null,
        disabled: true
      }),

      due: new FormControl({
        value: 0,
        disabled: true
      }),

      received: new FormControl({
        value: 0,
        disabled: true
      },
        Validators.min(1))
    });

    return form;
  }

  private toDate(date: string) {
    return formatDate(date, 'MMM d, yyyy', 'en')
  }

  get receivables() {
    return this.form.get('receivables') as FormArray;
  }
  get receivableForms() {
    return this.receivables.controls as FormGroup[];
  }
}
