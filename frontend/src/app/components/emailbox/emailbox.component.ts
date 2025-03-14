import { Component, forwardRef, Input } from '@angular/core';
import { FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator, Validators } from '@angular/forms';
import { VAccessorDirective } from '../utils/v-accessor.directive';

@Component({
  selector: 'emailbox',
  imports: [],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => EmailboxComponent),
    multi: true
  }, {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => EmailboxComponent),
    multi: true
  }],
  templateUrl: './emailbox.component.html',
  styleUrl: './emailbox.component.scss'
})
export class EmailboxComponent extends VAccessorDirective implements Validator {
  validate(control: FormControl) {
    return Validators.email(control);
  }
}
