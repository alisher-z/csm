import { AfterViewInit, Component, ContentChild, effect, ElementRef, inject, OnDestroy, QueryList, TemplateRef, ViewChildren } from '@angular/core';
import { DropdownService } from '../dropdown.service';
import { JsonPipe, NgTemplateOutlet } from '@angular/common';
import { Subscription } from 'rxjs';

type BlockType = 'center' | 'end' | 'nearest' | 'start';

@Component({
  selector: 'dropdown-list',
  imports: [NgTemplateOutlet],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class DropdownListComponent implements OnDestroy, AfterViewInit {
  @ContentChild('list') list: TemplateRef<any> | null = null;
  @ViewChildren('rows') rows!: QueryList<ElementRef>;

  subscriptions: Subscription[] = [];
  tblRows!: ElementRef<HTMLTableRowElement>[];
  index = -1;

  service = inject(DropdownService);
  constructor() {
    const { arrow } = this.service;

    this.subscriptions.push(
      arrow.subscribe((i) => this.arrow(i))
    );
  }
  arrow(i: number) {
    this.index = i;

    const row = this.getRow(i);
    this.scroll(row);
  }

  rowClick(item: any) {
    this.service.rowClick.emit(item);
  }

  getRow(index: number) {
    return this.tblRows[index].nativeElement;
  }
  scroll(row: HTMLTableRowElement) {
    row.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  get filtered() {
    return this.service.filtered();
  }
  get id() {
    if (this.service.item())
      return this.service.item().id;

    return null;
  }
  ngAfterViewInit(): void {
    this.tblRows = this.rows.toArray();
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
