import { Component, inject } from '@angular/core';
import { CustomerService } from './customer.service';
import { RouterOutlet } from '@angular/router';
import { GridviewComponent } from '../components/gridview/gridview.component';
import { GridviewDirective } from '../components/gridview/gridview.directive';

@Component({
  selector: 'app-customer',
  imports: [RouterOutlet, GridviewComponent],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss'
})
export class CustomerComponent extends GridviewDirective {
  override service = inject(CustomerService);
  override formPath = ['customer', 'form'];

  constructor() {
    super();
    this.init();
  }
}
