import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextboxComponent } from '../../components/textbox/textbox.component';
import { EmailboxComponent } from '../../components/emailbox/emailbox.component';
import { RichtextComponent } from '../../components/richtext/richtext.component';
import { MainFormComponent } from "../../components/form/form.component";
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule, TextboxComponent, EmailboxComponent, RichtextComponent, MainFormComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class CustomerFormComponent {
  fb = inject(FormBuilder);
  service = inject(CustomerService);
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
    this.service.insert(this.form.value).subscribe();
  }
}
