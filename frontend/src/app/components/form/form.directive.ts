import { Directive, inject, OnDestroy, Signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MainService } from '../main.service';
import { MainFormService } from './form.service';
import { Subscription } from 'rxjs';
import { formatDate } from '@angular/common';
import { WipeDirective } from '../utils/wipe.directive';

@Directive({
  selector: '[appForm]'
})
export abstract class FormDirective extends WipeDirective implements OnDestroy {
  abstract service: MainService;
  abstract getForm(): FormGroup<any>;
  abstract setForm(): void;

  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  formService = inject(MainFormService);

  form!: FormGroup;
  id!: string | null;
  data!: WritableSignal<any | undefined>;
  loading!: Signal<boolean>;

  init() {
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id)
      this.service.id.set(+this.id);

    this.data = this.service.one.value;
    this.loading = this.service.one.isLoading;

    this.form = this.getForm();

    this.formService.service = this.service;
    this.formService.close.set(this.id ? '../..' : '../');
    this.formService.id = this.id;
    this.formService.loading = this.loading;
  }

  toDate(date: string) {
    return formatDate(date, 'yyyy-MM-dd', 'en');
  }
}
