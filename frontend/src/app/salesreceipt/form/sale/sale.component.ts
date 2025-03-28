import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WipeDirective } from '../../../components/utils/wipe.directive';

@Component({
  selector: 'app-sale',
  imports: [ReactiveFormsModule],
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.scss'
})
export class SaleComponent extends WipeDirective {
  salesForm!: FormArray;

  private desciption = new FormControl(null);
  private quantity = new FormControl(1, [Validators.required, Validators.min(1)]);
  private price = new FormControl({ value: 0, disabled: true });
  private total = new FormControl({ value: 0, disabled: true });
  private product = new FormControl(null, Validators.required);

  constructor() {
    super();

  }

  createSale() {
    const form = new FormGroup({
      description: this.desciption,
      quantity: this.quantity,
      price: this.price,
      total: this.total,
      references: new FormGroup({
        product: this.product
      })
    });


  }

  listen(sale: FormGroup) {
    const { price, quantity } = sale.controls;

    this.subscriptions.push(
      price.valueChanges.subscribe(() => this.calculatePrice(sale)),
      quantity.valueChanges.subscribe(() => this.calculatePrice(sale))
    )
  }

  calculatePrice(sale: FormGroup) {
    const { quantity, price, total } = sale.controls;

    total.setValue(+quantity * +price);
  }
}
