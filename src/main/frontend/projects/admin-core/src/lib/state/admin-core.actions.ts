import { createAction, props } from '@ngrx/store';
import { ComponentModel } from '@tailormap-viewer/api';

const adminCoreActionsPrefix = '[AdminCore]';

export const setApplicationId = createAction(
  `${adminCoreActionsPrefix} Set Application ID`,
  props<{ applicationId: number }>(),
);

export const loadComponentsConfig = createAction(
  `${adminCoreActionsPrefix} Load components config`,
);

export const loadComponentsConfigSuccess = createAction(
  `${adminCoreActionsPrefix} Load components config success`,
  props<{ config: ComponentModel[] }>(),
);

export const loadComponentsConfigFailed = createAction(
  `${adminCoreActionsPrefix} Load components config failed`,
);

export const setSelectedComponent = createAction(
  `${adminCoreActionsPrefix} Set selected component`,
  props<{ selectedComponent: string }>(),
);

export const updateComponentConfig = createAction(
  `${adminCoreActionsPrefix} Update component config`,
  props<{ config: ComponentModel }>(),
);
