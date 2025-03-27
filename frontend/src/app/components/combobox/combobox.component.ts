import { AfterViewInit, Component, ContentChild, EventEmitter, forwardRef, inject, Input, Output, TemplateRef, WritableSignal } from '@angular/core';
import { DropdownComponent } from "../dropdown/dropdown.component";
import { NgTemplateOutlet } from '@angular/common';
import { DropdownService } from '../dropdown/dropdown.service';
import { ComboboxDirective } from './combobox.directive';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'combobox',
  imports: [DropdownComponent, NgTemplateOutlet],
  providers: [
    DropdownService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ComboboxComponent),
      multi: true
    }
  ],
  templateUrl: './combobox.component.html',
  styleUrl: './combobox.component.scss'
})
export class ComboboxComponent extends ComboboxDirective implements AfterViewInit {
  @Input() data!: WritableSignal<any[] | undefined>;
  @Output() render = new EventEmitter<any>();
  @ContentChild('combo') combo: TemplateRef<any> | null = null;
  dropdownService = inject(DropdownService);

  get show() {
    return this.dropdownService.showList();
  }

  onRender(item: any) {
    this.input(item);
    this.render.emit(item);
  }
  constructor() {
    super();
  }
  ngAfterViewInit(): void {
    // console.log(this.value);
  }
}
