import { AfterViewInit, Component, ContentChild, effect, ElementRef, HostListener, inject, Input, signal, TemplateRef, WritableSignal } from '@angular/core';
import { DropdwonInputComponent } from "./input/input.component";
import { DropdownListComponent } from "./list/list.component";
import { DropdownService } from './dropdown.service';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'dropdown',
  imports: [DropdwonInputComponent, DropdownListComponent, NgTemplateOutlet],
  // providers: [DropdownService],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})
export class DropdownComponent implements AfterViewInit {
  @Input() data!: WritableSignal<any[] | undefined>;
  @ContentChild('dropdown') dropdown: TemplateRef<any> | null = null;

  service = inject(DropdownService);
  el = inject(ElementRef)

  constructor() {
    effect(() => {
      const data = this.data();
      if (!data) return;

      data.forEach(d => d.marked = d.name);

      this.service.data.set(data);
      this.service.filtered.set(data);
    });
  }
  get show() {
    return this.service.showList();
  }

  ngAfterViewInit(): void {
    // this.service.data = this.data;
    // console.log(this.el.nativeElement);
  }
  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent) {
    if (!this.el.nativeElement.contains(event.target))
      this.service.showList.set(false);
  }

  render(item: any) {
    console.log(item);
  }
}
