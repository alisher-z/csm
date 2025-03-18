import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GridviewComponent } from "../components/gridview/gridview.component";
import { GridviewDirective } from '../components/gridview/gridview.directive';
import { ProductService } from './product.service';

@Component({
  selector: 'app-product',
  imports: [RouterOutlet, GridviewComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent extends GridviewDirective {
  override service = inject(ProductService);
  override formPath = ['product', 'form'];

  constructor() {
    super();
    this.init();
  }
}
