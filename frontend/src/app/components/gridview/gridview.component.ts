import { NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, EventEmitter, Input, Output, resource, TemplateRef, WritableSignal } from '@angular/core';

@Component({
  selector: 'gridview',
  imports: [NgTemplateOutlet],
  templateUrl: './gridview.component.html',
  styleUrl: './gridview.component.scss'
})
export class GridviewComponent {
  @Input() data!: WritableSignal<any[] | undefined>;
  @Output('edit') _edit = new EventEmitter<number>();
  @ContentChild('row') row: TemplateRef<any> | null = null;
  isControl = true;

  rowClick() {
    this.isControl = !this.isControl;
  }
  edit(id: number) {
    this._edit.emit(id);
  }
}
