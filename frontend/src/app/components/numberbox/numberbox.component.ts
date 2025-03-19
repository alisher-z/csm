import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { VAccessorDirective } from '../utils/v-accessor.directive';

@Component({
  selector: 'numberbox',
  imports: [],
  templateUrl: './numberbox.component.html',
  styleUrl: './numberbox.component.scss',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NumberboxComponent),
    multi: true
  }]
})
export class NumberboxComponent extends VAccessorDirective {

}
