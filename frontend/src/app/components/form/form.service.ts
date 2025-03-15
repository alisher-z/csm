import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MainFormService {
  close = signal<string>('/');
  constructor() { }
}
