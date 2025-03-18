import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GridviewComponent } from '../components/gridview/gridview.component';
import { GridviewDirective } from '../components/gridview/gridview.directive';
import { SupplierService } from './supplier.service';

@Component({
  selector: 'app-supplier',
  imports: [RouterOutlet, GridviewComponent],
  templateUrl: './supplier.component.html',
  styleUrl: './supplier.component.scss'
})
export class SupplierComponent extends GridviewDirective {
  override service = inject(SupplierService);
  override formPath = ['supplier', 'form'];

  constructor() {
    super();
    this.init();
  }
}
