import { Directive, inject, OnInit, WritableSignal } from '@angular/core';
import { FormDirective } from '../../components/form/form.directive';
import { Validators } from '@angular/forms';
import { ReconciliationService } from '../reconciliation.service';
import { CustomerService } from '../../customer/customer.service';

@Directive({
  selector: '[appForm]'
})
export class ReconciliationFormDirective extends FormDirective implements OnInit {
  override service = inject(ReconciliationService);
  customerService = inject(CustomerService);

  customers!: WritableSignal<any[] | undefined>;

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

    return form;
  }

  override setForm(): void {
    /// TODO
  }

  setCustomer(id: number | null) {
    this.service.customer.set(id ?? -1);
  }
}
