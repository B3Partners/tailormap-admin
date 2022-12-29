import { createAction, props } from '@ngrx/store';
import { AppStylingModel, ComponentModel } from '@tailormap-viewer/api';

const adminCoreActionsPrefix = '[AdminCore]';

export const setApplicationId = createAction(
  `${adminCoreActionsPrefix} Set Application ID`,
  props<{ applicationId: number }>(),
);

export const loadApplicationConfig = createAction(
  `${adminCoreActionsPrefix} Load application config`,
);

export const loadApplicationConfigSuccess = createAction(
  `${adminCoreActionsPrefix} Load application config success`,
  props<{ componentsConfig: ComponentModel[]; styleConfig?: AppStylingModel }>(),
);

export const loadApplicationConfigFailed = createAction(
  `${adminCoreActionsPrefix} Load application config failed`,
);

export const setSelectedComponent = createAction(
  `${adminCoreActionsPrefix} Set selected component`,
  props<{ selectedComponent: string }>(),
);

export const updateComponentConfig = createAction(
  `${adminCoreActionsPrefix} Update component config`,
  props<{ config: ComponentModel }>(),
);

export const updateStyleConfig = createAction(
  `${adminCoreActionsPrefix} Update style config`,
  props<{ config: Partial<AppStylingModel> }>(),
);

