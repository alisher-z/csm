import { Component, ContentChild, inject, Input, Output, TemplateRef, WritableSignal } from '@angular/core';
import { DropdownComponent } from "../dropdown/dropdown.component";
import { NgTemplateOutlet } from '@angular/common';
import { DropdownService } from '../dropdown/dropdown.service';

@Component({
  selector: 'combobox',
  imports: [DropdownComponent, NgTemplateOutlet],
  providers: [DropdownService],
  templateUrl: './combobox.component.html',
  styleUrl: './combobox.component.scss'
})
export class ComboboxComponent {
  @Input() data!: WritableSignal<any[] | undefined>;
  @ContentChild('combo') combo: TemplateRef<any> | null = null;
  dropdownService = inject(DropdownService);

  get show() {
    return this.dropdownService.showList();
  }
}
