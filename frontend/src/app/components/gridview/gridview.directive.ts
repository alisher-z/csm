import { Directive } from '@angular/core';
import { MainService } from '../main.service';
import { GridviewService } from './gridview.service';

// @Directive({
//   selector: '[appGridview]'
// })
export abstract class GridviewDirective {
  abstract service: MainService;
  abstract gridService: GridviewService;
  abstract formPath: string[];

  constructor() { }

  init() {
    this.gridService.service = this.service;
    this.gridService.data = this.service.list.value;
    this.gridService.formPath = this.formPath;
  }
}
