import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

@Directive({
  selector: '[appVAccessor]'
})
export class VAccessorDirective implements ControlValueAccessor {
  @Input() caption!: string;
  @Input() border = true;
  @Output() changes = new EventEmitter<any>();

  disabled: boolean = false;
  value: string | null = null;

  change!: (v: string) => void;
  touched!: () => void;

  writeValue(v: string) { this.value = v; }
  registerOnChange(fn: any) { this.change = fn; }
  registerOnTouched(fn: any) { this.touched = fn; }
  setDisabledState(d: boolean) { this.disabled = d; }

  input({ target }: Event) {
    this.value = (<HTMLInputElement>target).value;

    this.change(this.value);
    this.touched();
    this.changes.emit(this.value);
  }
}
