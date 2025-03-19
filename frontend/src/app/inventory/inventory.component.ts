import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GridviewComponent } from '../components/gridview/gridview.component';
import { GridviewDirective } from '../components/gridview/gridview.directive';
import { InventoryService } from './inventory.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-inventory',
  imports: [RouterOutlet, DatePipe, GridviewComponent],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent extends GridviewDirective {
  override service = inject(InventoryService);
  override formPath = ['inventory', 'form'];

  constructor() {
    super();
    this.init();
  }
}
