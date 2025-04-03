import { Component, effect, inject, OnInit, WritableSignal } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormDirective } from '../../components/form/form.directive';
import { MainService } from '../../components/main.service';
import { ReconciliationService } from '../reconciliation.service';
import { MainFormComponent } from "../../components/form/form.component";
import { MyDateComponent } from "../../components/my-date/my-date.component";
import { RichtextComponent } from "../../components/richtext/richtext.component";
import { CustomerService } from '../../customer/customer.service';
import { ComboboxComponent } from "../../components/combobox/combobox.component";

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule, MainFormComponent, MyDateComponent, RichtextComponent, ComboboxComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class ReconciliationFormComponent extends FormDirective implements OnInit {
  override service = inject(ReconciliationService);
  customerService = inject(CustomerService);

  customers!: WritableSignal<any[] | undefined>;

  constructor() {
    super();
    // effect(() => console.log(this.customers()))
  }

  ngOnInit(): void {
    this.customers = this.customerService.list.value;
    this.init();
  }

  getForm(): FormGroup<any> {
    return this.fb.group({
      date: [this.toDate(Date()), Validators.required],
      description: [],
      customer: [],
      // receivables: this.fb.array([])
    })
  }

  setForm(): void {
    /// TODO
  }

}
