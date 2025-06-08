import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MainFormComponent } from "../../components/form/form.component";
import { MyDateComponent } from "../../components/my-date/my-date.component";
import { RichtextComponent } from "../../components/richtext/richtext.component";
import { ComboboxComponent } from "../../components/combobox/combobox.component";
import { ReceivableFormComponent } from "./receivable/receivable.component";
import { ReconciliationFormDirective } from './form.directive';

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule, MainFormComponent, MyDateComponent, RichtextComponent, ComboboxComponent, ReceivableFormComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class ReconciliationFormComponent extends ReconciliationFormDirective implements OnInit {

  constructor() {
    super();
    // effect(() => console.log(this.service.unclearedReceipts.value()))
  }

  override listen(form: FormGroup) {
    const customer = form.get('customer')!
      .valueChanges
      .subscribe((id) => this.setCustomer(id));

    this.subscriptions.push(
      customer
    );
  }

  selected() {
    const total = this.getTotalReceived();

    this.setValue(this.receivedC, total);
    this.selectAll(total);
  }

  totalE(value: number) {
    this.selectAll(value);
  }

  getTotalReceived() {
    const sum = (sum: number, r: any) => r.include ? sum + +r.received : sum;

    return this.receivablesV.reduce(sum, 0);
  }

  getIndeterminate(total: number) {
    return total > 0
      ? total !== this.dueV
      : false;
  }

  selectAll(total: number) {
    this.indeterminate = this.getIndeterminate(total);
    this.setValue(this.includeC, total <= 0 ? false : !this.indeterminate);
  }

  setReceivedAmount(v: number) {
    // let value = +v;
    // const check: FormGroup[] = [];
    // const controls = this.receivables.controls as FormGroup[];

    // controls.forEach(c => {
    //   const { include } = c.controls;
    //   if (include.value)
    //     check.push(c)
    // });

    // if (check.length > 0)
    //   check.forEach(c => {
    //     const { include, due, received } = c.controls;
    //     if (value < 1) {
    //       include.setValue(false, { emitEvent: false })
    //     }
    //     else if (value <= +due.value) {
    //       received.setValue(value, { emitEvent: false });
    //       value = 0;
    //     }
    //     else if (value > +due.value) {
    //       received.setValue(due.value, { emitEvent: false });
    //       value -= +received.value;
    //     }
    //   });
    // else
    //   controls.forEach(c => {
    //     const { include, due, received } = c.controls;
    //     if (value < 1) {
    //       include.setValue(false, { emitEvent: false })
    //     }
    //     else if (value <= +due.value) {
    //       received.setValue(value, { emitEvent: false });
    //       include.setValue(true, { emitEvent: false });
    //       value = 0;
    //     }
    //     else if (value > +due.value) {
    //       received.setValue(due.value, { emitEvent: false });
    //       include.setValue(true, { emitEvent: false });
    //       value -= +received.value;
    //     }
    //   })
  }
}
