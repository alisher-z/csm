import { AfterViewInit, Component, effect, ElementRef, inject, Input, signal, WritableSignal } from '@angular/core';
import { DropdwonInputComponent } from "./input/input.component";
import { DropdownListComponent } from "./list/list.component";
import { DropdownService } from './dropdown.service';

@Component({
  selector: 'dropdown',
  imports: [DropdwonInputComponent, DropdownListComponent],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})
export class DropdownComponent implements AfterViewInit {
  @Input() data!: WritableSignal<any[] | undefined>;

  service = inject(DropdownService);

  constructor() {
    effect(() => this.service.data.set(this.data()));
  }

  ngAfterViewInit(): void {
    // this.service.data = this.data;
    // console.log(this.el.nativeElement);
  }
}
