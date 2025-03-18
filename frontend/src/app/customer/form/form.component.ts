import { Component, effect, inject, OnInit, Signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextboxComponent } from '../../components/textbox/textbox.component';
import { EmailboxComponent } from '../../components/emailbox/emailbox.component';
import { RichtextComponent } from '../../components/richtext/richtext.component';
import { MainFormComponent } from "../../components/form/form.component";
import { CustomerService } from '../customer.service';
import { MainFormService } from '../../components/form/form.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule, TextboxComponent, EmailboxComponent, RichtextComponent, MainFormComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class CustomerFormComponent implements OnInit {
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  service = inject(CustomerService);
  formService = inject(MainFormService);

  form!: FormGroup;
  id!: string | null;
  customer!: WritableSignal<any | undefined>;
  isloading!: Signal<boolean>;


  constructor() {
    this.isloading = this.service.one.isLoading;
    this.customer = this.service.one.value;

    this.setCustomerID();
    this.setFormPath();
    this.buildForm();

    if (this.id)
      effect(() => {
        if (!this.isloading())
          this.setFormValues();
      })
  }

  ngOnInit(): void {
  }

  submit() {
    let send!: Observable<any>;

    send = this.id
      ? this.service.update(this.id, this.form.value)
      : this.service.insert(this.form.value);

    send.subscribe({
      next: (data) => {
        console.log(data);
        this.service.listReferesh.set('');
      }
    });
  }

  setCustomerID() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id)
      this.service.id.set(+this.id);
  }

  buildForm() {
    this.form = this.fb.group({
      name: [
        null, Validators.required
      ],
      phone: [null],
      email: [null],
      address: [null]
    });
  }

  setFormValues() {
    const { name, phone, email, address } = this.form.controls;
    const c = this.customer();

    name.setValue(c.name);
    phone.setValue(c.phone);
    email.setValue(c.email);
    address.setValue(c.address);
  }

  setFormPath() {
    if (this.id)
      return this.formService.close.set('../..');

    this.formService.close.set('../');
  }
}
