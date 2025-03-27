import { Directive } from '@angular/core';
import { VAccessorDirective } from '../utils/v-accessor.directive';

@Directive({
  selector: '[appCombobox]'
})
export class ComboboxDirective extends VAccessorDirective {
  override input(item: any): void {
    this.value = item.id;
    this.change(this.value as any);
    this.touched();
  }
}
