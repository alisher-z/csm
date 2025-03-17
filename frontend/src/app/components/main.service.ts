import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export abstract class MainService {
  protected abstract path: string;
  abstract id: WritableSignal<number>;
  abstract data: WritableSignal<any>;

  private url = 'http://localhost:3000';
  private http = inject(HttpClient);

  private get fullUrl() {
    return `${this.url}/${this.path}`;
  }

  list = httpResource<any[]>(() => ({
    url: this.fullUrl
  }));

  one = httpResource<any>(() => `${this.fullUrl}/${this.id()}`);

  insert = httpResource<any>(() => ({
    url: this.fullUrl,
    method: 'POST',
    body: this.data()
  }));

  // insert(data: any) {
  //   return this.http.post(this.fullUrl, data)
  // }
}
