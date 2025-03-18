import { Injectable, WritableSignal } from '@angular/core';
import { MainService } from '../main.service';

@Injectable({
  providedIn: 'root'
})
export class GridviewService {
  service!: MainService;
  formPath!: string[];
  data!: WritableSignal<any[] | undefined>;

  constructor() { }
}
