import { NgModule } from '@angular/core';
import { SharedModule } from '@tailormap-viewer/shared';
import { ComponentsConfigPageComponent } from './components-config-page/components-config-page.component';
import { MatListModule } from '@angular/material/list';
import { AdminCoreComponentsModule } from '../components/admin-core-components.module';

@NgModule({
  declarations: [
    ComponentsConfigPageComponent,
  ],
  imports: [
    SharedModule,
    MatListModule,
    AdminCoreComponentsModule,
  ],
  exports: [
    ComponentsConfigPageComponent,
  ],
})
export class AdminCorePagesModule {}
