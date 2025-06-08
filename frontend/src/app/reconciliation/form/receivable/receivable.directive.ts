import { Directive, effect, inject, input, Input, OnInit, signal, WritableSignal } from '@angular/core';
import { WipeDirective } from '../../../components/utils/wipe.directive';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { ReconciliationService } from '../../reconciliation.service';

@Directive({
  selector: '[appReceivable]'
})
export class ReceivableDirective extends WipeDirective implements OnInit {
  @Input() form!: FormGroup;

  service = inject(ReconciliationService);
  receipts!: WritableSignal<any[] | undefined>;
  indeterminate = input(false);
  indeterminates!: boolean[];

  constructor() {
    super();

    effect(() => {
      const r = this.receipts();

      if (!r)
        return;

      this.setForm(r);
      this.setIndeterminates(r);
    })
  }

  ngOnInit(): void {
    this.receipts = this.service.unclearedReceipts.value;
  }

  getForm() {
    const form = new FormGroup({
      include: new FormControl(false),
      receipt: new FormControl({ value: null, disabled: true }, Validators.required),
      date: new FormControl({ value: null, disabled: true }),
      due: new FormControl({ value: 0, disabled: true }),
      received: new FormControl({ value: 0, disabled: true }, Validators.min(1))
    });

    // this.listen(form);
    return form;
  }

  setForm(receipts: any[]) {
    this.receivables.clear();
    receipts.forEach(r => this.setReceivable(r));
    this.setTotal(receipts);
  }

  listen(form: FormGroup) {
    // const include = form.get('include')!
    //   .valueChanges
    //   .subscribe((v) => {
    //     // console.log('hello world')
    //     this.pick.emit(v)
    //   });

    // this.subscriptions.push(include);
  }

  setReceivable(receivable: any) {
    const form = this.getForm();
    const { receipt, date, due } = form.controls;

    receipt.setValue(receivable.id);
    date.setValue(formatDate(receivable.date, 'MMM d, yyyy', 'en') as any);
    due.setValue(receivable.amounts.due);

    this.receivables.push(form);
  }

  setTotal(receipts: any[]) {
    const due = this.form.get('total')?.get('due');
    const sum = receipts.reduce((sum, { amounts }) => sum + +amounts.due, 0);

    due?.setValue(sum, { emitEvent: false });
  }
  setIndeterminates(receipts: any[]) {
    this.indeterminates = new Array(receipts.length).fill(false);
  }
  setValue(c: AbstractControl, v: any, e = false) {
    c.setValue(v, { emitEvent: e });
  }
  patchValue(form: FormGroup, v: any, e = false) {
    form.patchValue(v, { emitEvent: e });
  }

  get receivables() {
    return this.form.get('receivables') as FormArray;
  }
  get total() {
    return (<FormGroup>this.form.get('total')).controls;
  }

  get totalDue() {
    const { due } = this.total;

    return +due.value;
  }

  get totalReceived() {
    const { received } = this.total;
    return +received.value;
  }
}
