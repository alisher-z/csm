import { Component, effect, inject } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MainFormComponent } from '../../components/form/form.component';
import { TextboxComponent } from '../../components/textbox/textbox.component';
import { RichtextComponent } from '../../components/richtext/richtext.component';
import { FormDirective } from '../../components/form/form.directive';
import { ProductService } from '../product.service';

@Component({
  selector: 'product-form',
  imports: [
    ReactiveFormsModule,
    MainFormComponent,
    TextboxComponent,
    RichtextComponent
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class ProductFormComponent extends FormDirective {
  service = inject(ProductService);

  constructor() {
    super();
    this.init();

    if (this.id)
      effect(() => !this.loading() ? this.setForm() : null);
  }

  getForm() {
    return this.fb.group({
      name: [null, Validators.required],
      description: [null]
    })
  }
  setForm() {
    const { name, description } = this.form.controls;
    const { name: pname, description: pdescription } = this.data();

    name.setValue(pname);
    description.setValue(pdescription);
  }
}
