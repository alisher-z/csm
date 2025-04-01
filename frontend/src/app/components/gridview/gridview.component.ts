import { NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, effect, EventEmitter, inject, Input, OnInit, Output, resource, TemplateRef, WritableSignal } from '@angular/core';
import { GridviewService } from './gridview.service';
import { MainService } from '../main.service';
import { Router } from '@angular/router';

@Component({
  selector: 'gridview',
  imports: [NgTemplateOutlet],
  templateUrl: './gridview.component.html',
  styleUrl: './gridview.component.scss'
})
export class GridviewComponent implements OnInit {
  router = inject(Router);
  service = inject(GridviewService);
  clientService!: MainService;
  data!: WritableSignal<any[] | undefined>;


  @Output('edit') _edit = new EventEmitter<number>();
  @Output('delete') _drop = new EventEmitter<number>();
  @ContentChild('row') row: TemplateRef<any> | null = null;

  constructor() {
    // effect(() => console.log(this.data()))
  }

  ngOnInit(): void {
    this.data = this.service.data;
    this.clientService = this.service.service;
  }

  isControl = true;

  rowClick() {
    this.isControl = !this.isControl;
  }
  edit(id: string) {
    this._edit.emit(+id);
    this.router.navigate([...this.service.formPath, id])
  }

  drop(id: number) {
    this._drop.emit(id);
    this.clientService
      .delete(id)
      .subscribe((data) => {
        console.log(data);
        this.clientService.listReferesh.set('');
      })
  }
}
