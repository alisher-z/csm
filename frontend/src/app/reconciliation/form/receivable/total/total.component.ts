import { AfterViewInit, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'reconciliation-total',
  imports: [],
  templateUrl: './total.component.html',
  styleUrl: './total.component.scss'
})
export class ReconciliationTotalComponent implements AfterViewInit {
  @Input() form!: FormGroup;



  ngAfterViewInit(): void {
    // console.log(this.form.getRawValue());
  }
}
