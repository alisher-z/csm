import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextboxComponent } from '../../components/textbox/textbox.component';
import { EmailboxComponent } from '../../components/emailbox/emailbox.component';

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule, TextboxComponent, EmailboxComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class CustomerFormComponent {
  fb = inject(FormBuilder);
  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      name: [],
      phone: [],
      email: [],
      address: []
    });
  }

  submit() {
    console.log(this.form.invalid);
  }
}
