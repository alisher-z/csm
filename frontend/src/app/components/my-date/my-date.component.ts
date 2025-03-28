import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { VAccessorDirective } from '../utils/v-accessor.directive';

@Component({
  selector: 'my-date',
  imports: [],
  templateUrl: './my-date.component.html',
  styleUrl: './my-date.component.scss',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MyDateComponent),
    multi: true
  }]
})
export class MyDateComponent extends VAccessorDirective {

}
