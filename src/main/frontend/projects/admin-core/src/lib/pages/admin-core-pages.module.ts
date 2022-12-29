import { NgModule } from '@angular/core';
import { SharedModule } from '@tailormap-viewer/shared';
import { MatListModule } from '@angular/material/list';
import { AdminCoreComponentsModule } from '../components/admin-core-components.module';
import { ApplicationConfigPageModule } from './application-config-page/application-config-page.module';

@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    MatListModule,
    AdminCoreComponentsModule,
    ApplicationConfigPageModule,
  ],
  exports: [
    ApplicationConfigPageModule,
  ],
})
export class AdminCorePagesModule {}
