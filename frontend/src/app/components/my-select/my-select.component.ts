import { AfterViewInit, Component, effect, forwardRef, Input, signal, WritableSignal } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { VAccessorDirective } from '../utils/v-accessor.directive';

@Component({
  selector: 'my-select',
  imports: [],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MySelectComponent),
    multi: true
  }],
  templateUrl: './my-select.component.html',
  styleUrl: './my-select.component.scss'
})
export class MySelectComponent extends VAccessorDirective {
  @Input() options: WritableSignal<{ id: string, name: string }[] | undefined> = signal([]);

  constructor() {
    super();
    effect(() => {
      if (!this.options())
        return;

      const values = this.options();
      if (values && values.length > 0) {
        this.value = values[0].id;
        this.change(this.value);
        this.touched();
      }
    })
  }
}
