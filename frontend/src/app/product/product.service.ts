import { Injectable } from '@angular/core';
import { MainService } from '../components/main.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends MainService {
  protected override path = 'product';
}
