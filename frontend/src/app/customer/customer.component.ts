import { Component, inject, OnInit } from '@angular/core';
import { CustomerService } from './customer.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-customer',
  imports: [RouterOutlet],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss'
})
export class CustomerComponent implements OnInit {
  service = inject(CustomerService);

  ngOnInit(): void {
    // this.service.getAll().subscribe((data) => console.log(data));
  }
}
