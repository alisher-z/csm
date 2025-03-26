import { Directive, effect, ElementRef, HostListener, inject } from '@angular/core';
import { DropdownService } from '../dropdown.service';
import { DomSanitizer } from '@angular/platform-browser';

@Directive({
  selector: '[input-events]'
})
export class InputDirective {
  el = inject(ElementRef);
  service = inject(DropdownService);
  sanitizer = inject(DomSanitizer);

  textbox: HTMLInputElement;
  index = 0;

  constructor() {
    this.textbox = this.el.nativeElement;
    this.data?.forEach(d => d.marked = this.sanitizer.bypassSecurityTrustHtml(d.name));
  }

  @HostListener('input') input() {
    const filtered = this.filteredData;
    this.sort(filtered);
    this.service.filtered.set(filtered);
    this.selectItem(filtered);
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
  @HostListener('keydown', ['$event']) keydown({ key }: KeyboardEvent) {
    if (key === 'ArrowUp')
      if (this.index < this.service.filtered()?.length!)
        this.index++;

    console.log(this.index);
  }

  get data() {
    return this.service.data();
  }

  get filteredData() {
    const value = this.textbox.value.toLowerCase();

    const a = this.data?.filter((d) => {
      if (d.name.toLowerCase().startsWith(value)) {
        const regex = new RegExp(`^(${value})`, 'gi');
        const highlighted = d.name.replace(regex, '<mark>$1</mark>');
        d.marked = this.sanitizer.bypassSecurityTrustHtml(highlighted);

        return true;
      } else
        return false;
    })
    console.log(a);
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
    this.index = 0;
  }
}
