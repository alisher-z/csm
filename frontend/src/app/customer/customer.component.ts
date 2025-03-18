import { Component, computed, effect, inject, linkedSignal, OnInit, ResourceStatus, WritableSignal } from '@angular/core';
import { CustomerService } from './customer.service';
import { Router, RouterOutlet } from '@angular/router';
import { GridviewComponent } from '../components/gridview/gridview.component';

@Component({
  selector: 'app-customer',
  imports: [RouterOutlet, GridviewComponent],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss'
})
export class CustomerComponent implements OnInit {
  service = inject(CustomerService);
  route = inject(Router);
  customers: WritableSignal<any[] | undefined>;

  constructor() {
    this.customers = this.service.list.value;
  }

  ngOnInit(): void {
  }

  edit(id: number) {
    this.route.navigate(['customer', 'form', id]);
  }

  drop(id: number) {
    this.service
      .delete(id)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.service.listReferesh.set('');
        }
      });
  }
}
