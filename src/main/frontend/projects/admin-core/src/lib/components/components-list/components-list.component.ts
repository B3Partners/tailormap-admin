import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ConfigurationComponentRegistryService } from '../../services/configuration-component-registry.service';
import { map, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { setSelectedComponent } from '../../state/admin-core.actions';

@Component({
  selector: 'tm-components-list',
  templateUrl: './components-list.component.html',
  styleUrls: ['./components-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentsListComponent {

  private configurationComponentRegistryService = inject(ConfigurationComponentRegistryService);
  private store$ = inject(Store);

  public listOfComponents$: Observable<Array<{ type: string; label: string }>>;

  constructor() {
    this.listOfComponents$ = this.configurationComponentRegistryService.getRegisteredConfigurationComponents$()
      .pipe(
        map((components) => {
          const componentsList: Array<{ type: string; label: string }> = [];
          components.forEach((value, key) => {
            componentsList.push({ type: key, label: value.label });
          });
          return componentsList;
        }),
      );
  }

  public setActiveComponent(component: string) {
    this.store$.dispatch(setSelectedComponent({ selectedComponent: component }));
  }

}
