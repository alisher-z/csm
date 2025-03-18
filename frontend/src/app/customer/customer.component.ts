import { Component, computed, effect, inject, linkedSignal, OnInit, ResourceStatus, WritableSignal } from '@angular/core';
import { CustomerService } from './customer.service';
import { Router, RouterOutlet } from '@angular/router';
import { GridviewComponent } from '../components/gridview/gridview.component';
import { GridviewService } from '../components/gridview/gridview.service';
import { MainService } from '../components/main.service';
import { GridviewDirective } from '../components/gridview/gridview.directive';

@Component({
  selector: 'app-customer',
  imports: [RouterOutlet, GridviewComponent],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss'
})
export class CustomerComponent extends GridviewDirective {
  override service = inject(CustomerService);
  override gridService = inject(GridviewService);
  override formPath = ['customer', 'form'];

  constructor() {
    super();
    this.init();
  }
}
