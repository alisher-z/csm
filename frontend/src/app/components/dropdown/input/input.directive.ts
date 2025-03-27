import { Directive, effect, ElementRef, EventEmitter, HostListener, inject, OnDestroy, Output } from '@angular/core';
import { DropdownService } from '../dropdown.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[input-events]'
})
export class InputDirective implements OnDestroy {
  @Output() render = new EventEmitter<any>();
  el = inject(ElementRef);
  service = inject(DropdownService);
  sanitizer = inject(DomSanitizer);

  subscriptions: Subscription[] = [];
  textbox!: HTMLInputElement;
  index = -1;

  constructor() {
    this.init();
  }

  private init() {
    this.textbox = this.el.nativeElement;
    this.subscriptions.push(
      this.service.rowClick.subscribe((item) => {
        this.service.item.set(item);
        if (!this.service.item()) return;

        const filtered = this.service.filtered();
        if (!filtered) return;
        const _item = this.service.item();
        this.index = filtered.findIndex((d) => d.id == _item.id);

        this.textbox.value = this.service.item().name;
        this.textbox.focus();
        this.hide();
      }),
      this.service.btnClick.subscribe(() => {
        if (this.index >= 0)
          setTimeout(() => this.service.arrow.emit(this.index), 0)
      })
    )
  }

  @HostListener('input') input() {
    this.show();
    const filtered = this.getFiltered(this.textbox.value);

    if (!filtered) return;

    this.sort(filtered);
    this.service.filtered.set(filtered);
    this.selectItem(filtered);
  }

  @HostListener('focus')
  focus() {
    this.textbox.select();
    if (this.index >= 0)
      setTimeout(() => this.service.arrow.emit(this.index), 0);
    this.show();
  }

  @HostListener('blur')
  blur() {
    if (this.textbox.value === '')
      this.service.item.set(null);

    if (this.service.item())
      this.textbox.value = this.service.item().name;

    this.render.emit(this.service.item());
  }

  @HostListener('keydown', ['$event'])
  keydown({ key }: KeyboardEvent) {
    // console.log(key);
    const filtered = this.service.filtered();

    if (!filtered) return;

    if (key == 'ArrowDown')
      this.arrowDown(filtered);
    else if (key == 'ArrowUp')
      this.arrowUp();
    else if (key == 'Enter')
      this.enter();
    else if (key === 'Escape')
      this.hide();

    if (this.index >= 0)
      setTimeout(() =>
        this.service.arrow.emit(this.index), 0);

  }
  @HostListener('keyup', ['$event'])
  keyup({ key }: KeyboardEvent) {
    const keys = ['ArrowUp', 'ArrowDown'];
    if (keys.includes(key))
      this.textbox.select();
  }

  get data() {
    return this.service.data();
  }

  private enter() {
    if (this.index < 0) return;

    this.textbox.value = this.service.item().name;
    this.hide();
  }

  private selectItem(data: any[]) {
    if (data.length < 1)
      return this.service.item.set(null);

    this.service.item.set(data[0]);
    this.index = 0;
    this.service.arrow.emit(this.index);
  }

  private arrowUp() {
    if (!this.service.showList()) return;
    this.downIndex();
    this.service.item.set(this.service.filtered()[this.index])
    setTimeout(() => this.textbox.setSelectionRange(-1, -1), 0);
    this.textbox.value = this.service.item().name;
  }
  private arrowDown(data: any[]) {
    if (!this.service.showList())
      return this.show();

    this.upIndex(data.length);
    this.service.item.set(this.service.filtered()[this.index]);
    this.textbox.value = this.service.item().name;
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

  private show() {
    this.service.showList.set(true);
  }
  private hide() {
    this.service.showList.set(false);
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
