import { Component, effect, inject, signal, WritableSignal } from '@angular/core';
import { FormDirective } from '../../components/form/form.directive';
import { SaleReceiptService } from '../salereceipt.service';
import { FormArray, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MainFormComponent } from "../../components/form/form.component";
import { MyDateComponent } from "../../components/my-date/my-date.component";
import { CustomerService } from '../../customer/customer.service';
import { RichtextComponent } from "../../components/richtext/richtext.component";
import { NumberboxComponent } from "../../components/numberbox/numberbox.component";
import { ComboboxComponent } from "../../components/combobox/combobox.component";
import { SaleFormComponent } from "./sale/sale.component";

@Component({
  selector: 'sales-receipt-form',
  imports: [ReactiveFormsModule, MainFormComponent, MyDateComponent, RichtextComponent, NumberboxComponent, ComboboxComponent, SaleFormComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class SalesReceiptFormComponent extends FormDirective {
  override service = inject(SaleReceiptService);
  customerService = inject(CustomerService);

  customers: WritableSignal<any[] | undefined>;
  sales = signal<any[] | null>(null);
  salesInit = false;

  constructor() {
    super();
    this.init();
    this.listen();

    this.customers = this.customerService.list.value;

    if (this.id)
      effect(() => !this.loading() ? this.setForm() : null);
  }

  getForm() {
    return this.fb.group({
      date: [this.toDate(Date()), Validators.required],
      name: [],
      description: [],
      gift: [0],
      received: [0],
      total: [{ value: 0, disabled: true }],
      due: [{ value: 0, disabled: true }],
      references: this.fb.group({
        customer: [null, Validators.required]
      }),
      items: this.fb.array([])
    });
  }

  setForm(): void {
    const { date, description, gift, received, total, due, references } = this.form.controls;
    const { customer } = (<FormGroup>references).controls;

    const receipt = this.data();
    this.sales.set(receipt.sales);

    date.setValue(this.toDate(receipt.date));
    description.setValue(receipt.description);
    gift.setValue(receipt.amounts.gift, { emitEvent: false });
    received.setValue(receipt.amounts.received, { emitEvent: false });
    total.setValue(receipt.amounts.total, { emitEvent: false });
    due.setValue(receipt.amounts.due, { emitEvent: false });
    customer.setValue(receipt.customer.id);
  }

  listen() {
    const total = this.form.get('total')?.valueChanges;
    const received = this.form.get('received')?.valueChanges;
    const gift = this.form.get('gift')?.valueChanges;

    this.subscriptions.push(
      total!.subscribe(() => this.calculateReceived()),
      received!.subscribe(() => this.calculateReceivable()),
      gift!.subscribe(() => this.calculateReceived())
    )
  }

  calculateTotalPrice() {
    const values = this.items.getRawValue();
    const totalPrice = values.reduce((sum, { total }) => sum + total, 0);

    const { total } = this.form.controls;
    total.setValue(totalPrice, { emitEvent: false });

    if (!this.id)
      this.calculateReceived();
    this.calculateReceivable();
  }

  calculateReceived() {
    const { total, gift, received } = this.form.controls;
    const totalReceived = +total.value > 0
      ? +total.value -
      +gift.value : 0;

    received.setValue(totalReceived, { emitEvent: false });
  }

  calculateReceivable() {
    const { total, gift, received, due } = this.form.controls;

    const receivable = +total.value > 0
      ? +total.value - +gift.value - +received.value
      : 0;
    due.setValue(receivable, { emitEvent: false });
  }

  changed() {
    this.calculateTotalPrice();
  }

  get items() {
    return this.form.get('items') as FormArray;
  }
}
