import { Directive, Input } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

@Directive({
  selector: '[appVAccessor]'
})
export class VAccessorDirective implements ControlValueAccessor {
  @Input() caption!: string;

  value: string | null = null;

  change!: (v: string) => void;
  touched!: () => void;

  writeValue(v: string) { this.value = v; }
  registerOnChange(fn: any) { this.change = fn; }
  registerOnTouched(fn: any) { this.touched = fn; }

  input({ target }: Event) {
    this.value = (<HTMLInputElement>target).value;

    this.change(this.value);
    this.touched();
  }
}
