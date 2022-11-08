import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AdminCoreActions from './admin-core.actions';
import { concatMap, map, catchError, of } from 'rxjs';
import { ApplicationDetailsService } from '../services/application-details.service';

@Injectable()
export class AdminCoreEffects {

  private actions$ = inject(Actions);
  private appDetailsService = inject(ApplicationDetailsService);

  public triggerLoadConfig$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AdminCoreActions.setApplicationId),
      map(() => AdminCoreActions.loadComponentsConfig()),
    );
  });

  public loadComponentsConfig$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AdminCoreActions.loadComponentsConfig),
      concatMap(_action => {
        return this.appDetailsService.getComponentsConfig$().pipe(
          catchError(() => {
            return of(null);
          }),
          map(response => {
            if (response === null) {
              return AdminCoreActions.loadComponentsConfigFailed();
            }
            return AdminCoreActions.loadComponentsConfigSuccess({
              config: response,
            });
          }),
        );
      }),
    );
  });

}
