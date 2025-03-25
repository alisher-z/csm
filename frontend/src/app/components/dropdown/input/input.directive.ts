import { Directive, effect, ElementRef, HostListener, inject } from '@angular/core';
import { DropdownService } from '../dropdown.service';

@Directive({
  selector: '[input-events]'
})
export class InputDirective {
  el = inject(ElementRef);
  service = inject(DropdownService);
  textbox: HTMLInputElement;

  constructor() {
    this.textbox = this.el.nativeElement;
  }

  @HostListener('input') input() {
    const value = this.textbox.value;
    const filtered = this.data?.filter(d => (<string>d.name).startsWith(value));
    this.service.filtered.set(filtered);
  }

  get data() {
    return this.service.data();
  }
}
