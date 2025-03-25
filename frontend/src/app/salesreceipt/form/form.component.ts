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
    // effect(() => console.log(this.data()));

    if (this.id)
      effect(() => !this.loading() ? this.setForm() : null);
  }
  addFormItem() {
    this.items.push(this.createItem());
  }
  removeFormItem(index: number) {
    this.items.removeAt(index);
  }

  createItem({ description = '', quantity = 1, price = 0, product = -1 }: { description?: string, quantity?: number, price?: number, product?: number } = {}) {
    const item = this.fb.group({
      description: [description],
      quantity: [quantity, [Validators.required, Validators.min(1)]],
      price: [{ value: price, disabled: true }],
      total: [{ value: 0, disabled: true }],
      references: this.fb.group({
        product: [product, Validators.required]
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
    const a = {
      "id": 3,
      "date": "2025-03-24T21:00:00.000Z",
      "description": null,
      "customer": {
        "id": 1,
        "name": "Zabiullah"
      },
      "amounts": {
        "gift": 0,
        "received": 1505
      },
      "sales": [
        {
          "id": 4,
          "price": 5,
          "product": {
            "id": 1,
            "name": "iphone 6"
          },
          "quantity": 1,
          "description": null
        },
        {
          "id": 5,
          "price": 1500,
          "product": {
            "id": 2,
            "name": "iphone 7"
          },
          "quantity": 1,
          "description": null
        }
      ]
    };

    const { date, description, gift, received } = this.form.controls;
    const { customer } = (<FormGroup>this.form.get('references')).controls;
    const receipt = this.data();
    const _items: any[] = receipt.sales;

    this.items.removeAt(0);

    date.setValue(formatDate(receipt.date, 'yyyy-MM-dd', 'en'), { emitEvent: false });
    description.setValue(receipt.description, { emitEvent: false });
    gift.setValue(receipt.amounts.gift);
    received.setValue(receipt.amounts.received);
    customer.setValue(receipt.customer.id, { emitEvent: false });

    _items.forEach((sale: any) => {
      const item = this.createItem(
        //   {
        //   description: sale.description,
        //   quantity: sale.quantity,
        //   price: sale.price,
        //   product: sale.product.id
        // }
      );
      const { description, quantity, price } = item.controls;
      const { product } = (<FormGroup>item.get('references')).controls;

      description.setValue(sale.description);
      quantity.setValue(sale.quantity, { emitEvent: false });
      price.setValue(sale.price, { emitEvent: false });
      product.setValue(sale.product.id);

      // console.log(item.value);
      this.items.push(item);
    });
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
