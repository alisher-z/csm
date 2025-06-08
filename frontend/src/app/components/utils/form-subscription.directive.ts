import { Directive } from '@angular/core';
import { WipeDirective } from './wipe.directive';
import { FormGroup } from '@angular/forms';

@Directive({
  selector: '[appFormSubscription]'
})
export abstract class FormSubscriptionDirective extends WipeDirective {
  abstract form: FormGroup;

  sub(label: string, cb: (v: any) => void) {
    const control = this.form.get(label);

    if (!control) return;

    const subscription = control.valueChanges.subscribe(cb);

    this.subscriptions.push(subscription);
  }
}
