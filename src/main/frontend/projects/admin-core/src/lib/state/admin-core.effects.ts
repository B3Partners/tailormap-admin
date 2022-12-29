import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AdminCoreActions from './admin-core.actions';
import { concatMap, map, catchError, of, forkJoin } from 'rxjs';
import { ApplicationDetailsService } from '../services/application-details.service';

@Injectable()
export class AdminCoreEffects {

  private actions$ = inject(Actions);
  private appDetailsService = inject(ApplicationDetailsService);

  public triggerLoadConfig$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AdminCoreActions.setApplicationId),
      map(() => AdminCoreActions.loadApplicationConfig()),
    );
  });

  public loadApplicationConfig$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AdminCoreActions.loadApplicationConfig),
      concatMap(_action => {
        return forkJoin([
          this.appDetailsService.getComponentsConfig$().pipe(catchError(() => of(null))),
          this.appDetailsService.getApplicationStyling$().pipe(catchError(() => of(null))),
        ]).pipe(
          map(([ componentsConfig, styleConfig ]) => {
            if (componentsConfig === null || styleConfig === null) {
              return AdminCoreActions.loadApplicationConfigFailed();
            }
            const emptyComponentsConfig = !Array.isArray(componentsConfig) || componentsConfig.length === 0;
            return AdminCoreActions.loadApplicationConfigSuccess({
              componentsConfig: emptyComponentsConfig ? [] : componentsConfig,
              styleConfig: !styleConfig ? {} : styleConfig,
            });
          }),
        );
      }),
    );
  });

}
