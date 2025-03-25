import { effect, Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {
  data = signal<any[] | undefined>(undefined);
  filtered = signal<any[] | undefined>([]);

  constructor() {
  }
}
