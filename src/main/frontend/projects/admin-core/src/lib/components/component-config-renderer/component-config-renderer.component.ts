import {
  Component, OnInit, ChangeDetectionStrategy, inject, ChangeDetectorRef, ViewChild, ViewContainerRef, OnDestroy, ComponentRef, Type,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { selectComponentsConfig, selectSelectedComponent } from '../../state/admin-core.selectors';
import { BehaviorSubject, concatMap, of, Subject, take, takeUntil, tap } from 'rxjs';
import { ConfigurationComponentRegistryService } from '../../services/configuration-component-registry.service';
import { DynamicComponentsHelper, SnackBarMessageComponent, SnackBarMessageOptionsModel } from '@tailormap-viewer/shared';
import { BaseComponentConfigComponent } from '../base-component-config/base-component-config.component';
import { ApplicationDetailsService } from '../../services/application-details.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'tm-component-config-renderer',
  templateUrl: './component-config-renderer.component.html',
  styleUrls: ['./component-config-renderer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentConfigRendererComponent implements OnInit, OnDestroy {

  @ViewChild('componentConfigContainer', { read: ViewContainerRef, static: true })
  private componentConfigContainer: ViewContainerRef | null = null;

  private store$ = inject(Store);
  private snackBar = inject(MatSnackBar);

  private configurationComponentRegistryService = inject(ConfigurationComponentRegistryService);
  private cdr = inject(ChangeDetectorRef);
  private appDetailsService = inject(ApplicationDetailsService);

  private saving$ = new BehaviorSubject<boolean>(false);
  public isSaving$ = this.saving$.asObservable();
  private destroyed = new Subject();
  private renderedConfigurationComponent: ComponentRef<unknown> | undefined;
  private availableComponents: Map<string, { component: Type<any>; label: string }> = new Map();
  public selectedComponent: string | undefined;

  public ngOnInit() {
    this.store$.select(selectSelectedComponent)
      .pipe(takeUntil(this.destroyed))
      .subscribe((component) => {
        this.selectedComponent = component;
        this.renderActiveComponentConfiguration(component);
        this.cdr.detectChanges();
      });

    this.configurationComponentRegistryService.getRegisteredConfigurationComponents$()
      .pipe(takeUntil(this.destroyed))
      .subscribe(availableComponents => {
        this.availableComponents = availableComponents;
      });
  }

  public save() {
    this.store$.select(selectComponentsConfig)
      .pipe(
        take(1),
        tap(() => {
          this.saving$.next(true);
        }),
        concatMap(config => {
          if (!config) {
            return of(null);
          }
          return this.appDetailsService.updateComponentsConfig$(config);
        }),
      )
      .subscribe(() => {
        this.saving$.next(false);
        const config: SnackBarMessageOptionsModel = { message: $localize `Configuration saved`, duration: 2000 };
        SnackBarMessageComponent.open$(this.snackBar, config);
      });
  }

  public ngOnDestroy() {
    this.destroyed.next(null);
    this.destroyed.complete();
  }

  private renderActiveComponentConfiguration(selectedComponent?: string) {
    if (!this.componentConfigContainer) {
      return;
    }
    if (this.renderedConfigurationComponent) {
      DynamicComponentsHelper.destroyComponents([this.renderedConfigurationComponent]);
    }
    if (!selectedComponent) {
      return;
    }
    const configComponent: { component: Type<any>; label: string } = this.availableComponents.get(selectedComponent) || {
      component: BaseComponentConfigComponent,
      label: selectedComponent.charAt(0).toUpperCase() + selectedComponent.slice(1),
    };
    this.componentConfigContainer.clear();
    this.renderedConfigurationComponent = this.componentConfigContainer.createComponent(configComponent.component);
    this.renderedConfigurationComponent.setInput('type', selectedComponent);
    this.renderedConfigurationComponent.setInput('label', configComponent.label);
  }

}
