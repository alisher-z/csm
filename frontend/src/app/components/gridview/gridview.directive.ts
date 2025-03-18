import { Directive, inject } from '@angular/core';
import { MainService } from '../main.service';
import { GridviewService } from './gridview.service';
import { AppService } from '../../app.service';

// @Directive({
//   selector: '[appGridview]'
// })
export abstract class GridviewDirective {
  abstract service: MainService;
  abstract formPath: string[];

  gridService = inject(GridviewService);
  private appService = inject(AppService);

  constructor() { }

  init() {
    this.gridService.service = this.service;
    this.gridService.data = this.service.list.value;
    this.gridService.formPath = this.formPath;

    this.appService.formUrl.set(this.formPath);
  }
}
