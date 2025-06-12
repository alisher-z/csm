import { AfterViewInit, Component, effect, EventEmitter, inject, Input, OnInit, Output, ViewChild, WritableSignal } from '@angular/core';
import { AbstractControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextboxComponent } from "../../../components/textbox/textbox.component";
import { NumberboxComponent } from "../../../components/numberbox/numberbox.component";
import { ChangeRowsFormDirective } from '../../../salesreceipt/form/form.directive';
import { CheckboxComponent } from "../../../components/checkbox/checkbox.component";
import { ReceivableDirective } from './receivable.directive';
import { ReconciliationService } from '../../reconciliation.service';
import { ReconciliationFormTotal } from '../base/reconciliation-total';
import { ReconciliationFormSelection } from '../base/reconciliation-selection.directive';

@Component({
  selector: 'form-receivable',
  imports: [ReactiveFormsModule, FormsModule, TextboxComponent, NumberboxComponent, ChangeRowsFormDirective, CheckboxComponent, ReconciliationFormTotal, ReconciliationFormSelection],
  templateUrl: './receivable.component.html',
  styleUrl: './receivable.component.scss'
})
export class ReceivableFormComponent extends ReceivableDirective implements OnInit, AfterViewInit {
  @ViewChild(ReconciliationFormTotal) rft!: ReconciliationFormTotal;
  @ViewChild(ReconciliationFormSelection) rfs!: ReconciliationFormSelection;

  @Input() form!: FormGroup;

  receipts!: WritableSignal<any[] | undefined>;

  service = inject(ReconciliationService);

  constructor() {
    super();

    effect(() => {
      const receipts = this.receipts();
      if (!receipts) return;

      this.createForm(receipts);
      this.createIndeterminates(receipts);
      this.rft.setDue();
    })
  }

  ngOnInit(): void {
    this.receipts = this.getReceipts();
  }
  ngAfterViewInit(): void {
    this.rft.form = this.form;
    this.rfs.form = this.form;
    this.rfs.indeterminate = this.indeterminate;
    this.rfs.indeterminates = this.indeterminates;
  }

  totalReceivedChanged(value: number) {
    this.resetReceivables();
    this.resetIndeterminates();

    this.rft.changed(+value);
  }

  selectionChange(value: boolean, form: AbstractControl) {
    this.rfs.select(value, form);
    this.rft.setReceived();
    this.rfs.setIndeterminate(this.form);
    this.rfs.checkAll(this.form);
  }
  selectAllChange(value: boolean) {
    this.resetReceivables();
    this.resetIndeterminates();

    this.rfs.selectAll(value, this.receivableForms);
    this.rft.setReceived();
    this.rfs.setIndeterminate(this.form);
    this.rfs.checkAll(this.form);
  }
  indeterminateChange(index: number) {
    this.rfs.setIndeterminates(index);
  }

  private getReceipts() {
    return this.service.unclearedReceipts.value;
  }
}
