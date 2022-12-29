import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { setApplicationId } from '../../state/admin-core.actions';

@Component({
  selector: 'tm-application-config-page',
  templateUrl: './application-config-page.component.html',
  styleUrls: ['./application-config-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationConfigPageComponent implements OnInit {

  private store$ = inject(Store);

  public appId: number | null = null;

  public ngOnInit(): void {
    const appId = (window as any).currentApplicationId;
    if (typeof appId === 'undefined') {
      throw new Error('No application id found');
    }
    this.appId = +(appId);
    this.store$.dispatch(setApplicationId({ applicationId: this.appId }));
  }

}
