import { AdminCoreState, adminCoreStateKey } from './admin-core.state';
import { createFeatureSelector, createSelector } from '@ngrx/store';

const selectAdminCoreState = createFeatureSelector<AdminCoreState>(adminCoreStateKey);

export const selectComponentsConfigLoadStatus = createSelector(selectAdminCoreState, state => state.componentsConfigLoadStatus);
export const selectComponentsConfig = createSelector(selectAdminCoreState, state => state.componentsConfig);
export const selectSelectedComponent = createSelector(selectAdminCoreState, state => state.selectedComponent);
export const selectApplicationId = createSelector(selectAdminCoreState, state => state.applicationId);

export const selectComponentsConfigByType = (type: string) => createSelector(
  selectComponentsConfig,
  config => config?.components?.find(c => c.type === type),
);
