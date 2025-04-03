import { Component, effect, inject, OnInit, WritableSignal } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormDirective } from '../../components/form/form.directive';
import { MainService } from '../../components/main.service';
import { ReconciliationService } from '../reconciliation.service';
import { MainFormComponent } from "../../components/form/form.component";
import { MyDateComponent } from "../../components/my-date/my-date.component";
import { RichtextComponent } from "../../components/richtext/richtext.component";
import { CustomerService } from '../../customer/customer.service';
import { ComboboxComponent } from "../../components/combobox/combobox.component";
import { ReceivableFormComponent } from "./receivable/receivable.component";
import { delay } from '../../components/utils/custom-utills';

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule, MainFormComponent, MyDateComponent, RichtextComponent, ComboboxComponent, ReceivableFormComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class ReconciliationFormComponent extends FormDirective implements OnInit {
  override service = inject(ReconciliationService);
  customerService = inject(CustomerService);

  customers!: WritableSignal<any[] | undefined>;

  constructor() {
    super();
    // effect(() => console.log(this.service.unclearedReceipts.value()))
  }

  ngOnInit(): void {
    this.customers = this.customerService.list.value;
    this.init();
  }

  getForm(): FormGroup<any> {
    const form = this.fb.group({
      includeAll: [false],
      date: [this.toDate(Date()), Validators.required],
      description: [],
      customer: [],
      receivables: this.fb.array([])
    });

    this.listen(form);
    return form;
  }

  setForm(): void {
    /// TODO
  }

  listen(form: FormGroup) {
    const customer = form.get('customer')!
      .valueChanges
      .subscribe((id) => this.setCustomer(id));

    this.subscriptions.push(customer);
  }
  async select() {
    await delay();

    const values: any[] = this.receivables.value;
    const { includeAll } = this.form.controls;

    includeAll.setValue(values.every(c => c.include));
  }
  setCustomer(id: number | null) {
    this.service.customer.set(id ?? -1);
  }

  get receivables() {
    return this.form.get('receivables') as FormArray;
  }
}
