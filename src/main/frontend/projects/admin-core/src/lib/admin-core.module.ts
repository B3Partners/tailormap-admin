import { NgModule } from '@angular/core';
import { ICON_SERVICE_ICON_LOCATION, IconService, SharedModule } from '@tailormap-viewer/shared';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import { ComponentsConfigPageComponent } from './pages';
import { AdminCoreComponentsModule } from './components/admin-core-components.module';
import { AdminCorePagesModule } from './pages/admin-core-pages.module';
import { StoreModule } from '@ngrx/store';
import { adminCoreStateKey } from './state/admin-core.state';
import { adminCoreReducer } from './state/admin-core.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AdminCoreEffects } from './state/admin-core.effects';

const getBaseHref = (platformLocation: PlatformLocation): string => {
  return platformLocation.getBaseHrefFromDOM();
};

@NgModule({
  imports: [
    SharedModule,
    AdminCoreComponentsModule,
    AdminCorePagesModule,
    StoreModule.forRoot({
      [adminCoreStateKey]: adminCoreReducer,
    }, {
      runtimeChecks: {
        strictActionImmutability: true,
        strictActionSerializability: true,
        strictActionWithinNgZone: true,
        strictStateImmutability: true,
        strictStateSerializability: true,
        strictActionTypeUniqueness: true,
      },
    }),
    EffectsModule.forRoot([AdminCoreEffects]),
  ],
  exports: [
    ComponentsConfigPageComponent,
  ],
  providers: [
    { provide: ICON_SERVICE_ICON_LOCATION, useValue: 'assets/core/imgs/' },
    { provide: APP_BASE_HREF, useFactory: getBaseHref, deps: [PlatformLocation] },
  ],
})
export class AdminCoreModule {
  constructor(
    matIconRegistry: MatIconRegistry,
    domSanitizer: DomSanitizer,
    iconService: IconService,
  ) {
    iconService.loadIconsToIconRegistry(matIconRegistry, domSanitizer);
  }
}
