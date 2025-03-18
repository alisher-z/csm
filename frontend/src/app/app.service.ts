import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  formUrl = signal<string[]>([]);

  constructor() {
  }
}
