import { AfterViewInit, Directive, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormSubscriptionDirective } from '../../../../components/utils/form-subscription.directive';

@Directive({
  selector: '[reconciliationTFoot]'
})
export class ReconciliationTableFooterDirective extends FormSubscriptionDirective implements AfterViewInit {
  @Input('reconciliationTFoot') mainForm!: FormGroup;

  // override form = this.mainForm.get('total') as FormGroup;
  override form!: FormGroup<any>;


  ngAfterViewInit(): void {
    this.form = this.mainForm.get('total') as FormGroup;

    this.sub('received', this.onTotal);
  }

  onTotal(value: number) {
    console.log(value);
  }
}