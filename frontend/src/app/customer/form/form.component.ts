import { Component, inject, OnInit } from '@angular/core';
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


  constructor() {
    this.setCustomerID();
    this.buildForm();
    this.setFormPath();
  }

  ngOnInit(): void {
  }

  submit() {
    this.service.insert(this.form.value).subscribe();
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
