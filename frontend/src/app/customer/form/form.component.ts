import { Component, effect, inject } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { TextboxComponent } from '../../components/textbox/textbox.component';
import { EmailboxComponent } from '../../components/emailbox/emailbox.component';
import { RichtextComponent } from '../../components/richtext/richtext.component';
import { MainFormComponent } from "../../components/form/form.component";
import { CustomerService } from '../customer.service';
import { FormDirective } from '../../components/form/form.directive';

@Component({
  selector: 'customer-form',
  imports: [ReactiveFormsModule, TextboxComponent, EmailboxComponent, RichtextComponent, MainFormComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class CustomerFormComponent extends FormDirective {
  service = inject(CustomerService);

  constructor() {
    super();
    this.init();

    if (this.id)
      effect(() => {
        if (!this.loading())
          this.setForm();
      })
  }

  getForm() {
    return this.fb.group({
      name: [
        null, Validators.required
      ],
      phone: [null],
      email: [null],
      address: [null]
    });
  }

  setForm() {
    const { name, phone, email, address } = this.form.controls;
    const c = this.data();

    name.setValue(c.name);
    phone.setValue(c.phone);
    email.setValue(c.email);
    address.setValue(c.address);
  }
}
