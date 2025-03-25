import { Component } from '@angular/core';
import { InputDirective } from './input.directive';

@Component({
  selector: 'dropdown-input',
  imports: [InputDirective],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class DropdwonInputComponent {

}
