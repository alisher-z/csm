import { Injectable, signal } from '@angular/core';
import { MainService } from '../components/main.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends MainService {
  protected override path = 'customer';
  id = signal<number>(-1)
  data = signal<any>({ init: -1 });
}
