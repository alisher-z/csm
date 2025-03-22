import { Injectable } from '@angular/core';
import { MainService } from '../components/main.service';

@Injectable({
  providedIn: 'root'
})
export class SalereceiptService extends MainService {
  protected override path = 'sales-receipt';
}
