import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MainFormService } from './form.service';

@Component({
  selector: 'main-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class MainFormComponent {
  @Input('formGroup') form!: FormGroup;
  @Output() send = new EventEmitter();

  service = inject(MainFormService);

  submit() {
    this.form.markAllAsTouched()
    if (this.form.invalid)
      return;

    this.send.emit();
  }
  get close() {
    return this.service.close();
  }
}
