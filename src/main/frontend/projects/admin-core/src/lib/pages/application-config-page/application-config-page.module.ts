import { NgModule } from '@angular/core';
import { SharedModule } from '@tailormap-viewer/shared';
import { MatListModule } from '@angular/material/list';
import { AdminCoreComponentsModule } from '../../components/admin-core-components.module';
import { ApplicationConfigPageComponent } from './application-config-page.component';
import { ComponentsConfigTabComponent } from './components-config-tab/components-config-tab.component';
import { ApplicationStylingTabComponent } from './application-styling-tab/application-styling-tab.component';
import { AdminCoreStylingModule } from '../../styling/admin-core-styling.module';

@NgModule({
  declarations: [
    ApplicationConfigPageComponent,
    ComponentsConfigTabComponent,
    ApplicationStylingTabComponent,
  ],
  imports: [
    SharedModule,
    MatListModule,
    AdminCoreComponentsModule,
    AdminCoreStylingModule,
  ],
  exports: [
    ApplicationConfigPageComponent,
  ],
})
export class ApplicationConfigPageModule {}
