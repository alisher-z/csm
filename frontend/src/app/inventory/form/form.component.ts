import { Component, effect, inject, WritableSignal } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MainFormComponent } from '../../components/form/form.component';
import { TextboxComponent } from '../../components/textbox/textbox.component';
import { RichtextComponent } from '../../components/richtext/richtext.component';
import { FormDirective } from '../../components/form/form.directive';
import { MainService } from '../../components/main.service';
import { InventoryService } from '../inventory.service';
import { SupplierService } from '../../supplier/supplier.service';
import { MySelectComponent } from "../../components/my-select/my-select.component";
import { ProductService } from '../../product/product.service';
import { MyDateComponent } from "../../components/my-date/my-date.component";
import { NumberboxComponent } from "../../components/numberbox/numberbox.component";
import { formatDate } from '@angular/common';

@Component({
  selector: 'inventory-form',
  imports: [
    ReactiveFormsModule,
    MainFormComponent,
    RichtextComponent,
    MySelectComponent,
    MyDateComponent,
    NumberboxComponent
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class InventoryFormComponent extends FormDirective {
  override service = inject(InventoryService);
  supplierService = inject(SupplierService);
  productService = inject(ProductService);
  suppliers: WritableSignal<any[] | undefined>;
  products: WritableSignal<any[] | undefined>;

  constructor() {
    super();
    this.init();
    this.suppliers = this.supplierService.list.value;
    this.products = this.productService.list.value;

    if (this.id)
      effect(() => !this.loading() ? this.setForm() : null);
  }

  getForm() {
    return this.fb.group({
      date: [
        this.today,
        Validators.required
      ],
      description: [null],
      quantity: [1],
      current: [true],
      prices: this.fb.group({
        purchase: [0],
        sale: [0]
      }),
      references: this.fb.group({
        product: [null, Validators.required],
        supplier: [null, Validators.required]
      })
    });
  }

  setForm() {
    const { date, description, quantity, current } = this.form.controls;
    const { purchase, sale } = (<FormGroup>this.form.get('prices')).controls;
    const { product, supplier } = (<FormGroup>this.form.get('references')).controls;

    const i = this.data();
    date.setValue(formatDate(i.date, 'yyyy-MM-dd', 'en'));
    description.setValue(i.description);
    quantity.setValue(i.quantity);
    current.setValue(i.current);
    purchase.setValue(i.prices.purchase);
    sale.setValue(i.prices.sale);
    product.setValue(i.references.product);
    supplier.setValue(i.references.supplier);
  }
  get today() {
    return formatDate(Date(), 'yyyy-MM-dd', 'en');
  }
}
