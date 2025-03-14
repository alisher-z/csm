import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export abstract class MainService {
  protected abstract path: string;
  private url = 'http://localhost:3000';
  private http = inject(HttpClient);

  private get fullUrl() {
    return `${this.url}/${this.path}`;
  }

  getAll() {
    return this.http.get(this.fullUrl);
  }

  insert(data: any) {
    return this.http.post(this.fullUrl, data)
  }
}
