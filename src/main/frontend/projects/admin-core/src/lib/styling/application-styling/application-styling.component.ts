import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectStyleConfig } from '../../state/admin-core.selectors';
import { BehaviorSubject, concatMap, Observable, of, take, tap } from 'rxjs';
import { AppStylingModel } from '@tailormap-viewer/api';
import { PopoverPositionEnum, SnackBarMessageComponent, SnackBarMessageOptionsModel } from '@tailormap-viewer/shared';
import { ApplicationDetailsService } from '../../services/application-details.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { updateStyleConfig } from '../../state/admin-core.actions';

@Component({
  selector: 'tm-application-styling',
  templateUrl: './application-styling.component.html',
  styleUrls: ['./application-styling.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationStylingComponent {

  public stylingConfig$: Observable<AppStylingModel>;
  private saving$ = new BehaviorSubject<boolean>(false);
  public isSaving$ = this.saving$.asObservable();

  public DEFAULT_PRIMARY_COLOR = 'rgb(98, 54, 255)';
  public dropdownPosition = PopoverPositionEnum.BOTTOM_LEFT_DOWN;

  constructor(
    private store$: Store,
    private appDetailsService: ApplicationDetailsService,
    private snackBar: MatSnackBar,
  ) {
    this.stylingConfig$ = this.store$.select(selectStyleConfig);
  }

  public onPrimaryColorChange($event: string) {
    this.store$.dispatch(updateStyleConfig({ config: { primaryColor: $event } }));
  }

  public save() {
    this.store$.select(selectStyleConfig)
      .pipe(
        take(1),
        tap(() => {
          this.saving$.next(true);
        }),
        concatMap(config => {
          if (!config) {
            return of(null);
          }
          return this.appDetailsService.updateApplicationStyling$(config);
        }),
      )
      .subscribe(() => {
        this.saving$.next(false);
        const config: SnackBarMessageOptionsModel = { message: $localize `Configuration saved`, duration: 2000 };
        SnackBarMessageComponent.open$(this.snackBar, config);
      });
  }

  public onImageChanged($event: string) {
    this.store$.dispatch(updateStyleConfig({ config: { logo: $event } }));
  }

}
