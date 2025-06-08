import { AfterViewInit, Component, effect, ElementRef, EventEmitter, forwardRef, input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'checkbox',
  imports: [],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CheckboxComponent),
    multi: true
  }],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss'
})
export class CheckboxComponent {
  @Output() changes = new EventEmitter<boolean>();
  @ViewChild('checkbx') checkboxRef!: ElementRef<HTMLInputElement>;

  indeterminate = input<boolean>(false);
  checked = false;
  disabled = false;

  constructor() {
    effect(() => {
      this.indeterminate();

      if (this.checkboxRef)
        this.checkboxRef.nativeElement.indeterminate = this.indeterminate();
    })
  }

  change!: (v: boolean) => void;
  touched!: () => void;

  writeValue(v: boolean) { this.checked = v; }
  registerOnChange(fn: any) { this.change = fn; }
  registerOnTouched(fn: any) { this.touched = fn; }
  setDisabledState(d: boolean) { this.disabled = d; }

  toggle() {
    if (this.disabled) return;

    this.checked = !this.checked;
    this.change(this.checked);
    this.touched();
    this.changes.emit(this.checked);
  }
}
