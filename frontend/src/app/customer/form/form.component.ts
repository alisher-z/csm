import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextboxComponent } from '../../components/textbox/textbox.component';
import { EmailboxComponent } from '../../components/emailbox/emailbox.component';
import { RichtextComponent } from '../../components/richtext/richtext.component';
import { MainFormComponent } from "../../components/form/form.component";
import { CustomerService } from '../customer.service';
import { MainFormService } from '../../components/form/form.service';

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule, TextboxComponent, EmailboxComponent, RichtextComponent, MainFormComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class CustomerFormComponent {
  fb = inject(FormBuilder);
  service = inject(CustomerService);
  formService = inject(MainFormService);
  form: FormGroup;


  constructor() {
    this.formService.close.set('../');
    this.form = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      phone: [],
      email: [],
      address: []
    });
  }

  submit() {
    this.service.insert(this.form.value).subscribe();
  }
}
