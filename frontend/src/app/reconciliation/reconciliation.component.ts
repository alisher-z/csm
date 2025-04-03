import { Component, effect, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GridviewDirective } from '../components/gridview/gridview.directive';
import { ReconciliationService } from './reconciliation.service';
import { GridviewComponent } from "../components/gridview/gridview.component";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-reconciliation',
  imports: [RouterOutlet, GridviewComponent, DatePipe],
  templateUrl: './reconciliation.component.html',
  styleUrl: './reconciliation.component.scss'
})
export class ReconciliationComponent extends GridviewDirective implements OnInit {
  override service = inject(ReconciliationService);
  override formPath = ['reconciliation', 'form'];

  ngOnInit(): void {
    this.init();
  }
}
