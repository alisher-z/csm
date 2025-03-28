import { Directive, ElementRef, HostListener, inject, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[zaGridRows]'
})
export class ChangeRowsFormDirective implements OnChanges {
  @Input() zaGridRows: number = 1;

  el = inject(ElementRef);
  renderer = inject(Renderer2);

  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['zaGridRows']) return;

    const template = `repeat(${this.zaGridRows}, min-content) 1fr`;

    this.renderer.setStyle(this.el.nativeElement, 'grid-template-rows', template);
  }
  @HostListener('scroll') scroll() {
    const tbody: HTMLTableSectionElement = this.el.nativeElement;
    if (tbody.scrollHeight > tbody.clientHeight) {
      console.log('appeared');
    }
  }
}
