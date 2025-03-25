import { Component, effect, inject } from '@angular/core';
import { GridviewDirective } from '../components/gridview/gridview.directive';
import { SaleReceiptService } from './salereceipt.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-salesreceipt',
  imports: [RouterOutlet],
  templateUrl: './salesreceipt.component.html',
  styleUrl: './salesreceipt.component.scss'
})
export class SalesReceiptComponent extends GridviewDirective {
  override service = inject(SaleReceiptService);
  override formPath = ['sales-receipt', 'form'];

  constructor() {
    super();
    this.init();

    effect(() => console.log(this.service.list.value()));
  }
}
