import { Component, EventEmitter, inject, Output } from '@angular/core';
import { InputDirective } from './input.directive';
import { DropdownService } from '../dropdown.service';

@Component({
  selector: 'dropdown-input',
  imports: [InputDirective],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class DropdwonInputComponent {
  @Output() render = new EventEmitter<any>();
  service = inject(DropdownService);

  click() {
    this.service.showList.set(!this.service.showList());
    this.service.btnClick.emit();
  }

  onRender(item: any) {
    this.render.emit(item);
  }
}
