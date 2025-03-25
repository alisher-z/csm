import { Component, ContentChild, inject, TemplateRef } from '@angular/core';
import { DropdownService } from '../dropdown.service';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'dropdown-list',
  imports: [NgTemplateOutlet],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class DropdownListComponent {
  @ContentChild('line') line: TemplateRef<any> | null = null;

  service = inject(DropdownService);

  get filtered() {
    return this.service.filtered();
  }
}
