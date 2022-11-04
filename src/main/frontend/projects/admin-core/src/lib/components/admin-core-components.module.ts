import { NgModule } from '@angular/core';
import { SharedModule } from '@tailormap-viewer/shared';
import { BaseComponentConfigComponent } from './base-component-config/base-component-config.component';
import { ConfigurationComponentRegistryService } from '../services/configuration-component-registry.service';
import { MatListModule } from '@angular/material/list';
import { ComponentsListComponent } from './components-list/components-list.component';
import { ComponentConfigRendererComponent } from './component-config-renderer/component-config-renderer.component';

@NgModule({
  declarations: [
    BaseComponentConfigComponent,
    ComponentsListComponent,
    ComponentConfigRendererComponent,
  ],
  imports: [
    SharedModule,
    MatListModule,
  ],
  exports: [
    BaseComponentConfigComponent,
    ComponentsListComponent,
    ComponentConfigRendererComponent,
  ],
})
export class AdminCoreComponentsModule {
  constructor(
    configurationComponentService: ConfigurationComponentRegistryService,
  ) {
    configurationComponentService.registerConfigurationComponents('toc', $localize `Table of contents`, BaseComponentConfigComponent);
    configurationComponentService.registerConfigurationComponents('legend', $localize `Legend`, BaseComponentConfigComponent);
    configurationComponentService.registerConfigurationComponents('drawing', $localize `Drawing`, BaseComponentConfigComponent);
    configurationComponentService.registerConfigurationComponents('print', $localize `Print`, BaseComponentConfigComponent);
    configurationComponentService.registerConfigurationComponents('attributeList', $localize `Attribute list`, BaseComponentConfigComponent);
    configurationComponentService.registerConfigurationComponents('measure', $localize `Measure tools`, BaseComponentConfigComponent);
    configurationComponentService.registerConfigurationComponents('coordinate_picker', $localize `Coordinate picker tool`, BaseComponentConfigComponent);
  }
}
