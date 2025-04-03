import { Injectable, signal } from '@angular/core';
import { MainService } from '../components/main.service';
import { httpResource } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReconciliationService extends MainService {
  protected override path = 'reconciliation';

  customer = signal<number>(-1);

  unclearedReceipts = httpResource<any[]>(() => ({
    url: this.fullUrl + '/uncleared',
    params: {
      customer: this.customer()
    }
  }))
}
