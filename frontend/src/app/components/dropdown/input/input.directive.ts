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

  textbox!: HTMLInputElement;
  index = -1;

  constructor() {
    this.init();
  }

  private init() {
    this.textbox = this.el.nativeElement;
    this.initFiltered();
  }

  @HostListener('input') input() {
    const filtered = this.getFiltered(this.textbox.value);

    if (!filtered) return;

    this.sort(filtered);
    this.service.filtered.set(filtered);
    this.selectItem(filtered);
  }

  @HostListener('focus')
  focus() {
    this.textbox.select();
    this.show();
  }

  @HostListener('blur')
  blur() {
    if (this.textbox.value === '')
      this.service.item.set(null);

    if (this.service.item())
      this.textbox.value = this.service.item().name;
  }

  @HostListener('keydown', ['$event'])
  keydown({ key }: KeyboardEvent) {
    const filtered = this.service.filtered();

    if (!filtered) return;

    if (key == 'ArrowDown')
      this.arrowDown(filtered);
    else if (key == 'ArrowUp')
      this.arrowUp();
    else if (key == 'Enter')
      this.enter();

    if (this.index >= 0)
      this.service.arrow.emit(this.index);
  }

  get data() {
    return this.service.data();
  }

  private enter() {

  }

  private selectItem(data: any[]) {
    if (data.length < 1)
      return this.service.item.set(null);

    this.service.item.set(data[0]);
    this.index = 0;
  }

  private arrowUp() {
    this.downIndex();
    setTimeout(() => this.textbox.setSelectionRange(-1, -1), 0);
  }
  private arrowDown(data: any[]) {
    this.upIndex(data.length);
  }
  private upIndex(max: number) {
    if (max > 1)
      if (this.index < max - 1)
        this.index++;
  }
  private downIndex() {
    if (this.index > 0)
      this.index--;
  }

  private getFiltered(text: string) {
    text = text.toLowerCase();
    if (!this.data) return;

    return this.data.filter(d => {
      const name: string = (<string>d.name).toLowerCase();

      if (!name.startsWith(text))
        return false;

      const regex = new RegExp(`^(${text})`, 'gi');
      const marked = name.replace(regex, '<mark>$1</mark>');

      d.marked = this.sanitizer.bypassSecurityTrustHtml(marked);
      return true;
    });
  }

  private sort(data: any[]) {
    data.sort((a, b) =>
      (<string>a.name)
        .toLowerCase()
        .localeCompare(
          (<string>b.name).toLowerCase()
        )
    )
  }

  private initFiltered() {
    this.data
      ?.forEach(d =>
        d.marked = this.sanitizer
          .bypassSecurityTrustHtml(d.name)
      );
  }
  private show() {
    this.service.showList.set(true);
  }
  private hide() {
    this.service.showList.set(false);
  }
}
