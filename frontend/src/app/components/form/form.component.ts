import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'main-form',
  imports: [ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class MainFormComponent {
  @Input('formGroup') form!: FormGroup;
  @Output() send = new EventEmitter();

  submit() {
    this.send.emit();
  }
}
