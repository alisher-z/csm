import { Component, effect, inject } from '@angular/core';
import { DropdownComponent } from "../components/dropdown/dropdown.component";
import { CustomerService } from '../customer/customer.service';
import { ComboboxComponent } from "../components/combobox/combobox.component";
import { ProductService } from '../product/product.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [ComboboxComponent, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  service = inject(CustomerService);
  prodService = inject(ProductService);

  customers = this.service.list.value;
  products = this.prodService.list.value;
  form = new FormGroup({
    customer: new FormControl(),
    product: new FormControl()
  });
  constructor() {
    // effect(() => console.log(this.customers()));
    this.form.controls.customer.setValue(63);
    this.form.controls.product.setValue(2);
  }
  submit() {
    console.log(this.form.value);
  }
  getData(item: any) {
    console.log(item);
  }
}
