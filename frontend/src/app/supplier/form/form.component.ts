import { Component, effect, inject } from '@angular/core';
import { SupplierService } from '../supplier.service';
import { FormDirective } from '../../components/form/form.directive';
import { Validators } from '@angular/forms';
import { MainFormComponent } from '../../components/form/form.component';
import { TextboxComponent } from '../../components/textbox/textbox.component';
import { EmailboxComponent } from '../../components/emailbox/emailbox.component';
import { RichtextComponent } from '../../components/richtext/richtext.component';

@Component({
  selector: 'supplier-form',
  imports: [MainFormComponent, TextboxComponent, EmailboxComponent, RichtextComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class SupplierFormComponent extends FormDirective {
  service = inject(SupplierService);

  constructor() {
    super();
    this.init();


    if (this.id)
      effect(() => {
        if (!this.loading())
          this.setForm();
      })

    console.log(this.form.value)
    this.form.markAsTouched()
  }

  getForm() {
    return this.fb.group({
      name: [
        null, Validators.required
      ],
      phone: [null],
      email: [null],
      address: [null]
    })
  }

  setForm() {
    const { name, phone, email, address } = this.form.controls;
    const supplier = this.data();

    name.setValue(supplier.name);
    phone.setValue(supplier.phone);
    email.setValue(supplier.email);
    address.setValue(supplier.address);
  }
}
