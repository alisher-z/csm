import { Component, effect, inject, OnInit, WritableSignal } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormDirective } from '../../components/form/form.directive';
import { MainService } from '../../components/main.service';
import { ReconciliationService } from '../reconciliation.service';
import { MainFormComponent } from "../../components/form/form.component";
import { MyDateComponent } from "../../components/my-date/my-date.component";
import { RichtextComponent } from "../../components/richtext/richtext.component";
import { CustomerService } from '../../customer/customer.service';
import { ComboboxComponent } from "../../components/combobox/combobox.component";
import { ReceivableFormComponent } from "./receivable/receivable.component";
import { delay } from '../../components/utils/custom-utills';

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule, MainFormComponent, MyDateComponent, RichtextComponent, ComboboxComponent, ReceivableFormComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class ReconciliationFormComponent extends FormDirective implements OnInit {
  override service = inject(ReconciliationService);
  customerService = inject(CustomerService);

  customers!: WritableSignal<any[] | undefined>;

  constructor() {
    super();
    // effect(() => console.log(this.service.unclearedReceipts.value()))
  }

  ngOnInit(): void {
    this.customers = this.customerService.list.value;
    this.init();
  }

  getForm(): FormGroup<any> {
    const form = this.fb.group({
      includeAll: [false],
      date: [this.toDate(Date()), Validators.required],
      description: [],
      customer: [],
      total: this.fb.group({
        due: [{ value: 0, disabled: true }],
        received: [0, [Validators.required, Validators.min(1)]]
      }),
      receivables: this.fb.array([])
    });

    this.listen(form);
    return form;
  }

  setForm(): void {
    /// TODO
  }

  listen(form: FormGroup) {
    const customer = form.get('customer')!
      .valueChanges
      .subscribe((id) => this.setCustomer(id));

    const includeAll = form.get('includeAll')!
      .valueChanges
      .subscribe((v) => this.selectAll(v));

    const received = form.get('total')!.get('received')!
      .valueChanges
      .subscribe((v) => this.setReceivedAmount(v));

    this.subscriptions.push(
      customer,
      includeAll,
      received
    );
  }

  async select() {
    await delay();

    const values: any[] = this.receivables.value;
    const { includeAll } = this.form.controls;

    includeAll.setValue(values.every(c => c.include), { emitEvent: false });
    this.setReceivable();
    this.setTotal();
  }

  setTotal() {
    const values: any[] = this.receivables.getRawValue();
    const { received } = this.total.controls;

    const sum = values.reduce((sum, { include, received }) => include ? sum + +received : sum, 0);

    received.setValue(sum, { emitEvent: false });
  }

  setReceivable() {
    const controls = this.receivables.controls as FormGroup[];

    controls.forEach(c => {
      const { include, due, received } = c.controls;
      if (include.value)
        received.setValue(due.value, { emitEvent: false });
    })
  }
  setReceivedAmount(v: number) {
    // console.log('hello zabiullah');
    let value = +v;
    const check: FormGroup[] = [];
    const controls = this.receivables.controls as FormGroup[];

    controls.forEach(c => {
      const { include } = c.controls;
      if (include.value)
        check.push(c)
    });

    if (check.length > 0)
      check.forEach(c => {
        const { include, due, received } = c.controls;
        if (value < 1) {
          include.setValue(false, { emitEvent: false })
        }
        else if (value <= +due.value) {
          received.setValue(value, { emitEvent: false });
          value = 0;
        }
        else if (value > +due.value) {
          received.setValue(due.value, { emitEvent: false });
          value -= +received.value;
        }
      });
    else
      controls.forEach(c => {
        const { include, due, received } = c.controls;
        if (value < 1) {
          include.setValue(false, { emitEvent: false })
        }
        else if (value <= +due.value) {
          received.setValue(value, { emitEvent: false });
          include.setValue(true, { emitEvent: false });
          value = 0;
        }
        else if (value > +due.value) {
          received.setValue(due.value, { emitEvent: false });
          include.setValue(true, { emitEvent: false });
          value -= +received.value;
        }
      })
  }

  setCustomer(id: number | null) {
    this.service.customer.set(id ?? -1);
  }
  selectAll(v: boolean) {
    const controls = (<FormGroup[]>this.receivables.controls);
    controls.forEach(c => {
      const { include } = c.controls;
      include.setValue(v, { emitEvent: false });
    });
    this.setReceivable();
    this.setTotal();
  }

  get receivables() {
    return this.form.get('receivables') as FormArray;
  }
  get total() {
    return this.form.get('total') as FormGroup;
  }
}
