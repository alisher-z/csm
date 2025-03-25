import { Component, effect, inject, OnDestroy, WritableSignal } from '@angular/core';
import { FormDirective } from '../../components/form/form.directive';
import { SaleReceiptService } from '../salereceipt.service';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MainFormComponent } from "../../components/form/form.component";
import { MyDateComponent } from "../../components/my-date/my-date.component";
import { formatDate } from '@angular/common';
import { CustomerService } from '../../customer/customer.service';
import { MySelectComponent } from "../../components/my-select/my-select.component";
import { RichtextComponent } from "../../components/richtext/richtext.component";
import { NumberboxComponent } from "../../components/numberbox/numberbox.component";
import { ProductService } from '../../product/product.service';
import { TextboxComponent } from "../../components/textbox/textbox.component";
import { Subscription } from 'rxjs';

@Component({
  selector: 'sales-receipt-form',
  imports: [ReactiveFormsModule, MainFormComponent, MyDateComponent, MySelectComponent, RichtextComponent, NumberboxComponent, TextboxComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class SalesReceiptFormComponent extends FormDirective implements OnDestroy {
  override service = inject(SaleReceiptService);
  customerService = inject(CustomerService);
  productService = inject(ProductService);

  customers: WritableSignal<any[] | undefined>;
  products: WritableSignal<any[] | undefined>;

  private subscriptions: Subscription[] = [];

  constructor() {
    super();
    this.init();

    this.customers = this.customerService.list.value;
    this.products = this.productService.list.value;
    this.subscriptions.push(
      this.form.get('total')?.valueChanges.subscribe(() => this.setRecieved())!,
      this.form.get('received')?.valueChanges.subscribe(() => this.calculateDue())!,
      this.form.get('gift')?.valueChanges.subscribe(() => {
        this.setRecieved();
        this.calculateDue();
      })!
    );
  }
  addFormItem() {
    this.items.push(this.createItem());
  }
  removeFormItem(index: number) {
    this.items.removeAt(index);
  }

  createItem() {
    const item = this.fb.group({
      description: [],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [{ value: 0, disabled: true }],
      total: [{ value: 0, disabled: true }],
      references: this.fb.group({
        product: [0, Validators.required]
      })
    });


    this.subscriptions.push(
      item.get('price')?.valueChanges.subscribe(() => this.total(item))!,
      item.get('quantity')?.valueChanges.subscribe(() => {
        this.total(item);
        this.setTotaoQuantity(item);
      })!,
      item.get('total')?.valueChanges.subscribe(() => this.grandTotal())!,
      item.get('references')?.get('product')?.valueChanges.subscribe(() => this.setTotaoQuantity(item))!
    );

    return item;
  }
  setTotaoQuantity(item: FormGroup) {
    const pid = item.get('references')?.get('product')?.value;
    const qty = item.get('quantity')?.value ?? 0;

    const product = this.products()?.filter((p: any) => p.id == pid)[0];

    item.get('inStock')?.setValue(product.quantity - qty, { emitEvent: false });
    item.get('price')?.setValue(product.sale);
  }
  total(item: FormGroup) {
    const quantity = item.get('quantity')?.value ?? 0;
    const price = item.get('price')?.value ?? 0;

    item.get('total')?.setValue(quantity * price);
  }
  grandTotal() {
    const sum = this.items
      .getRawValue()
      .reduce((sum, item) => sum + item.total || 0, 0);

    this.form.get('total')?.setValue(sum);
  }
  setRecieved() {
    const total = this.form.get('total')?.value;
    const gift = this.form.get('gift')?.value;
    const received = total > 0 ? total - gift : 0;

    this.form.get('received')?.setValue(received);
  }
  calculateDue() {
    const total = this.form.get('total')?.value;
    const received = this.form.get('received')?.value;
    const gift = this.form.get('gift')?.value;

    const due = total > 0 ? total - gift - received : 0;

    this.form.get('due')?.setValue(due, { emitEvent: false });
  }

  getForm() {
    return this.fb.group({
      date: [this.today, Validators.required],
      name: [],
      description: [],
      gift: [0],
      received: [0],
      total: [{ value: 0, disabled: true }],
      due: [{ value: 0, disabled: true }],
      references: this.fb.group({
        customer: [null, Validators.required]
      }),
      items: this.fb.array([
        this.createItem()
      ])
    });
  }

  setForm(): void {

  }

  get items() {
    return this.form.get('items') as FormArray;
  }
  get today() {
    return formatDate(Date(), 'yyyy-MM-dd', 'en');
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
