import { Component, effect, inject, WritableSignal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MainFormComponent } from '../../components/form/form.component';
import { TextboxComponent } from '../../components/textbox/textbox.component';
import { RichtextComponent } from '../../components/richtext/richtext.component';
import { FormDirective } from '../../components/form/form.directive';
import { MainService } from '../../components/main.service';
import { InventoryService } from '../inventory.service';
import { SupplierService } from '../../supplier/supplier.service';
import { MySelectComponent } from "../../components/my-select/my-select.component";
import { ProductService } from '../../product/product.service';

@Component({
  selector: 'inventory-form',
  imports: [
    ReactiveFormsModule,
    MainFormComponent,
    TextboxComponent,
    RichtextComponent,
    MySelectComponent
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
      date: [],
      description: [],
      quantity: [],
      current: [],
      prices: this.fb.group({
        purchase: [],
        sale: []
      }),
      references: this.fb.group({
        product: [],
        supplier: []
      })
    });
  }

  setForm() {
    const { date, description, quantity, current } = this.form.controls;
    const { purchase, sale } = (<FormGroup>this.form.get('prices')).controls;
    const { product, supplier } = (<FormGroup>this.form.get('references')).controls;

    const i = this.data();
    date.setValue(i.date);
    description.setValue(i.description);
    quantity.setValue(i.quantity);
    current.setValue(i.current);
    purchase.setValue(i.prices.purchase);
    sale.setValue(i.prices.sale);
    product.setValue(i.references.product);
    supplier.setValue(i.references.supplier);
  }
}
