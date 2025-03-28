import { Directive, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appWipe]'
})
export class WipeDirective implements OnDestroy {
  subscriptions: Subscription[] = [];

  ngOnDestroy(): void {
    if (this.subscriptions.length > 0)
      this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
