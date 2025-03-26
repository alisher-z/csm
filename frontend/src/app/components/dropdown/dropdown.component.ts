import { AfterViewInit, Component, ContentChild, effect, ElementRef, HostListener, inject, Input, signal, TemplateRef, WritableSignal } from '@angular/core';
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
  @ContentChild('line') line: TemplateRef<any> | null = null;

  service = inject(DropdownService);
  el = inject(ElementRef)

  constructor() {
    effect(() => {
      this.service.data.set(this.data());
      this.service.filtered.set(this.data());
    });
  }

  ngAfterViewInit(): void {
    // this.service.data = this.data;
    // console.log(this.el.nativeElement);
  }
  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent) {
    console.log((event.target as HTMLElement).closest('dropdown'));
  }
}
