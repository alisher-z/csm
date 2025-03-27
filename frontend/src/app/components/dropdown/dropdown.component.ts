import { AfterViewInit, Component, ContentChild, effect, ElementRef, EventEmitter, HostListener, inject, input, Input, Output, signal, TemplateRef, WritableSignal } from '@angular/core';
import { DropdwonInputComponent } from "./input/input.component";
import { DropdownListComponent } from "./list/list.component";
import { DropdownService } from './dropdown.service';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'dropdown',
  imports: [DropdwonInputComponent, DropdownListComponent, NgTemplateOutlet],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})
export class DropdownComponent implements AfterViewInit {
  @Input() data!: WritableSignal<any[] | undefined>;
  @Output('render') onRender = new EventEmitter<any>();
  @ContentChild('dropdown') dropdown: TemplateRef<any> | null = null;

  value = input<string | null>(null)
  border = input(true);
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
    this.service.border = this.border();
    effect(() => {
      if (!this.value()) return;
      this.service.value.set(this.value());
    })
    // this.service.value.set(this.value());
  }
  get show() {
    return this.service.showList();
  }

  ngAfterViewInit(): void {
    // console.log(this.border);
    // this.service.data = this.data;
    // console.log(this.el.nativeElement);
    // console.log(this.value());
  }
  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent) {
    if (!this.el.nativeElement.contains(event.target))
      this.service.showList.set(false);
  }

  render(item: any) {
    this.onRender.emit(item);
  }
}
