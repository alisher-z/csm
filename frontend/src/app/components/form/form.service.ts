import { Injectable, Signal, signal } from '@angular/core';
import { MainService } from '../main.service';

@Injectable({
  providedIn: 'root'
})
export class MainFormService {
  close = signal<string>('/');
  id!: string | null;
  service!: MainService;
  loading!: Signal<boolean>;

  constructor() { }
}
