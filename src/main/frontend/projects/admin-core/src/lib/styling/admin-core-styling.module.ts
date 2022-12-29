import { NgModule } from '@angular/core';
import { SharedModule } from '@tailormap-viewer/shared';
import { MatListModule } from '@angular/material/list';
import { ApplicationStylingComponent } from './application-styling/application-styling.component';
import { ImageUploadFieldComponent } from './image-upload-field/image-upload-field.component';

@NgModule({
  declarations: [
    ApplicationStylingComponent,
    ImageUploadFieldComponent,
  ],
  imports: [
    SharedModule,
    MatListModule,
  ],
  exports: [
    ApplicationStylingComponent,
  ],
})
export class AdminCoreStylingModule {}
