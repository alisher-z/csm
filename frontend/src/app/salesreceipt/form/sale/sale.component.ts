import { AfterViewInit, Component, effect, EventEmitter, inject, input, Input, OnInit, Output, WritableSignal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WipeDirective } from '../../../components/utils/wipe.directive';
import { ComboboxComponent } from "../../../components/combobox/combobox.component";
import { ProductService } from '../../../product/product.service';
import { TextboxComponent } from "../../../components/textbox/textbox.component";
import { NumberboxComponent } from "../../../components/numberbox/numberbox.component";
import { ChangeRowsFormDirective } from '../form.directive';

@Component({
  selector: 'sale-form',
  imports: [ReactiveFormsModule, ComboboxComponent, TextboxComponent, NumberboxComponent, ChangeRowsFormDirective],
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.scss'
})
export class SaleFormComponent extends WipeDirective implements OnInit {
  @Input('form') form!: FormGroup;
  @Output('change') saleChange = new EventEmitter();

  items = input<any[] | null>(null);
  productService = inject(ProductService);
  products!: WritableSignal<any[] | undefined>;

  constructor() {
    super();

    effect(() => {
      const items = this.items();
      this.forms.clear();

      if (!items)
        return this.initForms();

      this.setForms(items);
    })
  }

  ngOnInit(): void {
    this.products = this.productService.list.value;

    this.forms.clear();
    this.forms.push(this.getForm());
  }

  getForm() {
    const form = new FormGroup({
      description: new FormControl(null),
      quantity: new FormControl<number>(1, [Validators.required, Validators.min(1)]),
      price: new FormControl<number>({ value: 0, disabled: true }),
      total: new FormControl<number>({ value: 0, disabled: true }),
      references: new FormGroup({
        product: new FormControl<number | null>(null, Validators.required)
      })
    });

    this.listen(form);
    return form;
  }

  initForms() {
    this.forms.push(this.getForm());
  }

  setForms(items: any[]) {
    items.forEach(item => {
      const form = this.getForm();

      const { description, quantity, price, total, references } = form.controls;
      const { product } = references.controls;

      description.setValue(item.description);
      quantity.setValue(item.amounts.quantity, { emitEvent: false });
      price.setValue(item.amounts.price, { emitEvent: false });
      total.setValue(item.amounts.total, { emitEvent: false });
      product.setValue(item.product.id, { emitEvent: false });


      this.forms.push(form);
    });
  }

  listen(form: FormGroup) {
    const product = form.get('references')?.get('product')!;
    const price = form.get('price')!;
    const quantity = form.get('quantity')!

    this.subscriptions.push(
      price.valueChanges.subscribe(() => this.calculatePrice(form)),
      quantity.valueChanges.subscribe(() => this.calculatePrice(form)),
      product.valueChanges.subscribe(() => this.calculatePrice(form))
    )
  }

  calculatePrice(form: FormGroup) {
    const { quantity, price, total } = form.controls;
    this.setPrice(form);

    total.setValue(+quantity.value * +price.value, { emitEvent: false });

    this.saleChange.emit();
  }

  setPrice(form: FormGroup) {
    const priceControl = form.get('price')!;
    const productControl = form.get('references')!.get('product')!;

    if (!productControl.value) return;

    const price = this.getPriceValue(productControl.value);
    priceControl.setValue(price, { emitEvent: false });
  }

  getPriceValue(id: number) {
    const products = this.products();

    let price = 0;
    if (!products)
      return price;

    products.some(d => {
      if (d.id !== id) return false;
      price = d.sale;
      return true;
    });

    return price;
  }

  removeSale(index: number) {
    this.forms.removeAt(index);
  }
  addSale() {
    this.forms.push(this.getForm());
  }

  get forms() {
    return this.form.get('items') as FormArray;
  }
}
