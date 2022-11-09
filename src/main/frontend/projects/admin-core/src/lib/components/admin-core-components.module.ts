import { NgModule } from '@angular/core';
import { SharedModule } from '@tailormap-viewer/shared';
import { BaseComponentConfigComponent } from './base-component-config/base-component-config.component';
import { ConfigurationComponentRegistryService } from '../services/configuration-component-registry.service';
import { MatListModule } from '@angular/material/list';
import { ComponentsListComponent } from './components-list/components-list.component';
import { ComponentConfigRendererComponent } from './component-config-renderer/component-config-renderer.component';
import { BaseComponentTypeEnum } from '@tailormap-viewer/api';

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
    configurationComponentService.registerConfigurationComponents(BaseComponentTypeEnum.TOC, $localize `Table of contents`, BaseComponentConfigComponent);
    configurationComponentService.registerConfigurationComponents(BaseComponentTypeEnum.LEGEND, $localize `Legend`, BaseComponentConfigComponent);
    configurationComponentService.registerConfigurationComponents(BaseComponentTypeEnum.DRAWING, $localize `Drawing`, BaseComponentConfigComponent);
    configurationComponentService.registerConfigurationComponents(BaseComponentTypeEnum.PRINT, $localize `Print`, BaseComponentConfigComponent);
    configurationComponentService.registerConfigurationComponents(BaseComponentTypeEnum.ATTRIBUTE_LIST, $localize `Attribute list`, BaseComponentConfigComponent);
    configurationComponentService.registerConfigurationComponents(BaseComponentTypeEnum.MEASURE, $localize `Measure tools`, BaseComponentConfigComponent);
    configurationComponentService.registerConfigurationComponents(BaseComponentTypeEnum.COORDINATE_PICKER, $localize `Coordinate picker tool`, BaseComponentConfigComponent);
  }
}
