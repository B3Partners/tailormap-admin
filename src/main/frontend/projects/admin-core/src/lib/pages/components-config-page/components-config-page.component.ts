import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { setApplicationId } from '../../state/admin-core.actions';

@Component({
  selector: 'tm-components-config-page',
  templateUrl: './components-config-page.component.html',
  styleUrls: ['./components-config-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentsConfigPageComponent implements OnInit {

  private store$ = inject(Store);

  public ngOnInit(): void {
    const appId = (window as any).currentApplicationId;
    if (typeof appId === 'undefined') {
      throw new Error('No application id found');
    }
    this.store$.dispatch(setApplicationId({ applicationId: +(appId) }));
  }

}
