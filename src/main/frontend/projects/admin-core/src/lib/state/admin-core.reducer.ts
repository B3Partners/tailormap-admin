import * as AdminCoreActions from './admin-core.actions';
import { Action, createReducer, on } from '@ngrx/store';
import { AdminCoreState, initialAdminCoreState } from './admin-core.state';
import { LoadingStateEnum } from '@tailormap-viewer/shared';

const onSetApplicationId = (
  state: AdminCoreState,
  payload: ReturnType<typeof AdminCoreActions.setApplicationId>,
): AdminCoreState => ({
  ...state,
  applicationId: payload.applicationId,
});

const onLoadComponentsConfig = (
  state: AdminCoreState,
): AdminCoreState => ({
  ...state,
  componentsConfigLoadStatus: LoadingStateEnum.LOADING,
});

const onLoadComponentsConfigSuccess = (
  state: AdminCoreState,
  payload: ReturnType<typeof AdminCoreActions.loadComponentsConfigSuccess>,
): AdminCoreState => ({
  ...state,
  componentsConfigLoadStatus: LoadingStateEnum.LOADED,
  componentsConfig: payload.config,
});

const onLoadComponentsConfigFailed = (
  state: AdminCoreState,
): AdminCoreState => ({
  ...state,
  componentsConfigLoadStatus: LoadingStateEnum.FAILED,
});

const onSetSelectedComponent = (
  state: AdminCoreState,
  payload: ReturnType<typeof AdminCoreActions.setSelectedComponent>,
): AdminCoreState => ({
  ...state,
  selectedComponent: payload.selectedComponent,
});

const onUpdateComponentConfig = (
  state: AdminCoreState,
  payload: ReturnType<typeof AdminCoreActions.updateComponentConfig>,
): AdminCoreState => {
  if (!state.componentsConfig) {
    return {
      ...state,
      componentsConfig: [payload.config],
    };
  }
  const stateComponents = state.componentsConfig;
  const idx = stateComponents.findIndex(c => c.type === payload.config.type);
  const updatedComponents = idx !== -1
    ? [ ...stateComponents.slice(0, idx), payload.config, ...stateComponents.slice(idx + 1) ]
    : [ ...stateComponents, { ...payload.config }];
  return {
    ...state,
    componentsConfig: updatedComponents,
  };
};

const adminCoreReducerImpl = createReducer<AdminCoreState>(
  initialAdminCoreState,
  on(AdminCoreActions.setApplicationId, onSetApplicationId),
  on(AdminCoreActions.loadComponentsConfig, onLoadComponentsConfig),
  on(AdminCoreActions.loadComponentsConfigSuccess, onLoadComponentsConfigSuccess),
  on(AdminCoreActions.loadComponentsConfigFailed, onLoadComponentsConfigFailed),
  on(AdminCoreActions.setSelectedComponent, onSetSelectedComponent),
  on(AdminCoreActions.updateComponentConfig, onUpdateComponentConfig),
);
export const adminCoreReducer = (state: AdminCoreState | undefined, action: Action) => adminCoreReducerImpl(state, action);
