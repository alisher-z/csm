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

  constructor() {
    // effect(() => {
    //   const filtered = this.filtered();
    //   if (!filtered || filtered.length < 1) return;

    //   filtered.forEach(d => d.marked = d.name)
    // });
    // effect(() => console.log(this.filtered()))
  }
}
