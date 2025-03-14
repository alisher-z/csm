import { Component, forwardRef } from '@angular/core';
import { VAccessorDirective } from '../utils/v-accessor.directive';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'richtext',
  imports: [],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RichtextComponent),
    multi: true
  }],
  templateUrl: './richtext.component.html',
  styleUrl: './richtext.component.scss'
})
export class RichtextComponent extends VAccessorDirective {

}
