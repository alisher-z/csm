import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  service = inject(AppService);
  title = 'frontend';

  // get formUrl() {
  //   console.log(this.formUrl)
  //   return this.service.formUrl;
  // }

  ngOnInit(): void {
    // console.log(this.service.formUrl)
  }
}
