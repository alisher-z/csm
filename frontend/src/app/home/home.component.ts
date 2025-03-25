import { Component, effect, inject } from '@angular/core';
import { DropdownComponent } from "../components/dropdown/dropdown.component";
import { CustomerService } from '../customer/customer.service';

@Component({
  selector: 'app-home',
  imports: [DropdownComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  service = inject(CustomerService);
  customers = this.service.list.value;
  constructor() {
    // effect(() => console.log(this.customers()));
  }
}
