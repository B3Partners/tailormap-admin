import { Component, OnInit, ChangeDetectionStrategy, Input, inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectComponentsConfigByType } from '../../state/admin-core.selectors';
import { Subject, takeUntil } from 'rxjs';
import { ComponentConfigHelper } from '../../helpers/component-config.helper';
import { updateComponentConfig } from '../../state/admin-core.actions';
import { ComponentModel } from '@tailormap-viewer/api';

@Component({
  selector: 'tm-base-component-config',
  templateUrl: './base-component-config.component.html',
  styleUrls: ['./base-component-config.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseComponentConfigComponent implements OnInit, OnDestroy {

  private store$ = inject(Store);
  private cdr = inject(ChangeDetectorRef);
  private destroyed = new Subject();

  @Input()
  public type: string | undefined;

  @Input()
  public label: string | undefined;

  public component: ComponentModel | undefined = undefined;

  public ngOnInit(): void {
    if (!this.type) {
      throw new Error('No type given');
    }
    const type = this.type;
    this.store$.select(selectComponentsConfigByType(type))
      .pipe(takeUntil(this.destroyed))
      .subscribe(config => {
        this.component = config || ComponentConfigHelper.getBaseConfig(type);
        this.cdr.detectChanges();
      });
  }

  public ngOnDestroy() {
    this.destroyed.next(null);
    this.destroyed.complete();
  }

  public getEnabled() {
    if (!this.component) {
      return false;
    }
    return this.component.config.enabled;
  }

  public toggleEnabled() {
    if (!this.component) {
      return;
    }
    this.store$.dispatch(updateComponentConfig({
      config: {
        ...this.component,
        config: {
          ...this.component.config,
          enabled: !this.component.config.enabled,
        },
      },
    }));
  }

}
