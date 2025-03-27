import { effect, EventEmitter, Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {
  data = signal<any[]>([]);
  filtered = signal<any[]>([]);
  item = signal<any | null>(null);
  showList = signal<boolean>(false);

  arrow = new EventEmitter<number>();
  rowClick = new EventEmitter<any>();
  btnClick = new EventEmitter();

  constructor() {
    effect(() => {
      if (!this.showList()) return;

      const data = this.data();
      if (!data) return;

      data.forEach(d => d.marked = d.name);

      this.filtered.set(data);
    })
  }
}
