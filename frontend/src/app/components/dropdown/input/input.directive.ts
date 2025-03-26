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
    const filtered = this.filteredData;
    this.sort(filtered);
    this.service.filtered.set(filtered);
    this.selectItem(filtered);
    // this.selectPart(this.textbox);
  }
  @HostListener('focus') focus() {
    this.textbox.select();
  }
  @HostListener('blur') blur() {
    if (this.textbox.value === '')
      this.service.item.set(null);

    if (this.service.item())
      this.textbox.value = this.service.item().name;
  }

  get data() {
    return this.service.data();
  }

  get filteredData() {
    const value = this.textbox.value.toLowerCase();

    return this.data?.filter(d => d.name.toLowerCase().startsWith(value));
  }
  // selectPart(input: HTMLInputElement) {
  //   if (!this.service.item()) return;

  //   const text: string = input.value;
  //   const name: string = this.service.item().name

  //   const start = text.length;
  //   const end = name.length;

  //   const fullText = text + name.substring(start, end);
  //   console.log(fullText);

  //   // input.setSelectionRange(0, 1);
  // }

  sort(data: any[] | undefined) {
    if (!data)
      return;

    data.sort((a, b) =>
      (<string>a.name).toLowerCase()
        .localeCompare((<string>b.name))
    )
  }
  selectItem(data: any[] | undefined) {
    if (!data)
      return this.service.item.set(null);

    if (data.length < 1)
      return this.service.item.set(null);

    this.service.item.set(data[0]);
  }
}
