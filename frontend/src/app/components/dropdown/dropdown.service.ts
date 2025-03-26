import { effect, EventEmitter, Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {
  data = signal<any[] | undefined>(undefined);
  filtered = signal<any[] | undefined>([]);
  item = signal<any | null>(null);
  showList = signal<boolean>(false);

  arrow = new EventEmitter<number>();

  constructor() {
  }
}
