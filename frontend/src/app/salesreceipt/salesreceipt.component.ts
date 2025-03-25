import { Component, effect, inject } from '@angular/core';
import { GridviewDirective } from '../components/gridview/gridview.directive';
import { SaleReceiptService } from './salereceipt.service';
import { RouterOutlet } from '@angular/router';
import { GridviewComponent } from "../components/gridview/gridview.component";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-salesreceipt',
  imports: [RouterOutlet, GridviewComponent, DatePipe],
  templateUrl: './salesreceipt.component.html',
  styleUrl: './salesreceipt.component.scss'
})
export class SalesReceiptComponent extends GridviewDirective {
  override service = inject(SaleReceiptService);
  override formPath = ['sales-receipt', 'form'];

  constructor() {
    super();
    this.init();
  }
}
