import { Component, effect, inject, OnInit, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextboxComponent } from '../../components/textbox/textbox.component';
import { EmailboxComponent } from '../../components/emailbox/emailbox.component';
import { RichtextComponent } from '../../components/richtext/richtext.component';
import { MainFormComponent } from "../../components/form/form.component";
import { CustomerService } from '../customer.service';
import { MainFormService } from '../../components/form/form.service';
import { ActivatedRoute } from '@angular/router';

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
  customerId!: string | null;
  customer!: WritableSignal<any | undefined>;


  constructor() {
    this.setCustomerID();
    this.buildForm();
    this.setFormPath();
    this.customer = this.service.one.value;

    effect(() => console.log(this.customer()))
  }

  ngOnInit(): void {
  }

  submit() {
    this.service.data.set(this.form.value);
  }

  setCustomerID() {
    this.customerId = this.route.snapshot.paramMap.get('id');
  }
  buildForm() {
    this.form = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      phone: [],
      email: [],
      address: []
    });
  }
  setFormPath() {
    if (this.customerId)
      return this.formService.close.set('../..');

    this.formService.close.set('../');
  }
}
