import { Directive, inject, OnInit, WritableSignal } from '@angular/core';
import { FormDirective } from '../../components/form/form.directive';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MainService } from '../../components/main.service';
import { ReconciliationService } from '../reconciliation.service';
import { CustomerService } from '../../customer/customer.service';

@Directive({
  selector: '[appForm]'
})
export class ReconciliationFormDirective extends FormDirective implements OnInit {
  override service = inject(ReconciliationService);
  customerService = inject(CustomerService);

  customers!: WritableSignal<any[] | undefined>;
  listen(form: FormGroup): void { };
  indeterminate = false;

  ngOnInit() {
    this.customers = this.customerService.list.value;
    this.init();
  }

  override getForm() {
    const form = this.fb.group({
      includeAll: [false],
      date: [
        this.toDate(Date()),
        Validators.required
      ],
      description: [],
      customer: [],
      total: this.fb.group({
        due: [{ value: 0, disabled: true }],
        received: [0, [
          Validators.required,
          Validators.min(1)
        ]]
      }),
      receivables: this.fb.array([])
    });

    this.listen(form);
    return form;
  }

  override setForm(): void {
    /// TODO
  }

  setCustomer(id: number | null) {
    this.service.customer.set(id ?? -1);
  }

  setValue(control: AbstractControl, value: any, emitEvent = false) {
    control.setValue(value, { emitEvent })
  }

  get receivablesV() {
    return this.receivablesC.getRawValue() as any[];
  }
  get dueV() {
    return +this.form.get('total')?.get('due')?.value;
  }
  get receivablesC() {
    return this.form.get('receivables') as FormArray;
  }
  get includeC() {
    return this.form.get('includeAll')!;
  }
  get receivedC() {
    return this.form.get('total')?.get('received') as FormControl;
  }
}
