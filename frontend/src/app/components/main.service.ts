import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export abstract class MainService {
  protected abstract path: string;

  private url = 'http://localhost:3000';
  private http = inject(HttpClient);

  id = signal<number | undefined>(undefined)
  listReferesh = signal<string>('', { equal: () => false });

  get fullUrl() {
    return `${this.url}/${this.path}`;
  }

  list = httpResource<any[]>(() => ({
    url: this.fullUrl,
    params: {
      search: this.listReferesh()
    }
  }));

  one = httpResource<any>(() => this.id() ? `${this.fullUrl}/${this.id()}` : undefined);

  insert(data: any) {
    return this.http
      .post(this.fullUrl, data)
      .pipe(take(1));
  }

  update(id: string, data: any) {
    return this.http
      .put(`${this.fullUrl}/${id}`, data)
      .pipe(take(1));
  }

  delete(id: number) {
    return this.http
      .delete(`${this.fullUrl}/${id}`)
      .pipe(take(1));
  }
}
