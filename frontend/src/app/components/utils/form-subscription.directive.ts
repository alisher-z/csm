import { Directive } from '@angular/core';
import { WipeDirective } from './wipe.directive';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

@Directive({
  selector: '[appFormSubscription]'
})
export abstract class FormSubscriptionDirective extends WipeDirective {
  abstract form: FormGroup;

  sub(label: string | string[], cb: (v: any) => void) {
    let control: AbstractControl | undefined | null = this.form;

    if (typeof label === 'string')
      control = control.get(label);

    else
      for (const l of label)
        control = control?.get(l);

    if (!control) return;

    const subscription = control.valueChanges.subscribe(cb);

    this.subscriptions.push(subscription);
  }
}
