import { Component, forwardRef, HostListener, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'textbox',
  imports: [],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TextboxComponent),
    multi: true
  }],
  templateUrl: './textbox.component.html',
  styleUrl: './textbox.component.scss'
})
export class TextboxComponent implements ControlValueAccessor {
  @Input() caption!: string;
  value: string | null = null;

  onChange = (value: string) => { }
  onTouched = () => { }

  writeValue(v: string): void {
    this.value = v;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    /// TODO
  }

  notify(input: Event) {
    this.value = (<HTMLInputElement>input.target).value;
    this.onChange(this.value);
    this.onTouched();
  }
}
