import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MainFormService } from './form.service';
import { Observable } from 'rxjs';

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
  clientService = this.service.service;

  submit() {
    // console.log(this.form.getRawValue());
    this.form.markAllAsTouched();
    if (this.form.invalid)
      return;

    this.send.emit();

    const send = this.service.id
      ? this.clientService.update(this.service.id, this.form.getRawValue())
      : this.clientService.insert(this.form.getRawValue());

    send.subscribe((data) => {
      console.log(data);
      this.clientService.listReferesh.set('');
    });
  }
  get close() {
    return this.service.close();
  }
}
