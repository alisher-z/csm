import { Component, EventEmitter, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WipeDirective } from '../../../components/utils/wipe.directive';

@Component({
  selector: 'app-sale',
  imports: [ReactiveFormsModule],
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.scss'
})
export class SaleComponent extends WipeDirective {
  @Output('change') saleChange = new EventEmitter<number>();

  salesForm!: FormArray;

  private desciption = new FormControl(null);
  private quantity = new FormControl(1, [Validators.required, Validators.min(1)]);
  private price = new FormControl({ value: 0, disabled: true });
  private total = new FormControl({ value: 0, disabled: true });
  private product = new FormControl(null, Validators.required);

  constructor() {
    super();

  }

  getForm() {
    const form = new FormGroup({
      description: this.desciption,
      quantity: this.quantity,
      price: this.price,
      total: this.total,
      references: new FormGroup({
        product: this.product
      })
    });

    this.listen(form);
    return form;
  }

  listen(form: FormGroup) {
    const { price, quantity, references } = form.controls;
    const { product } = (<FormGroup>references).controls;

    this.subscriptions.push(
      price.valueChanges.subscribe(() => this.calculatePrice(form)),
      quantity.valueChanges.subscribe(() => this.calculatePrice(form)),
      product.valueChanges.subscribe(() => this.calculatePrice(form))
    )
  }

  calculatePrice(form: FormGroup) {
    const { quantity, price, total } = form.controls;

    total.setValue(+quantity * +price, { emitEvent: false });
    this.calculateTotalPrice();
  }
  calculateTotalPrice() {
    const values = this.salesForm.getRawValue();
    const totalPrice = values.reduce((sum, { total }) => sum + total, 0);

    this.saleChange.emit(totalPrice);
  }
}
