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

const onLoadApplicationConfig = (
  state: AdminCoreState,
): AdminCoreState => ({
  ...state,
  applicationConfigLoadStatus: LoadingStateEnum.LOADING,
});

const onLoadApplicationConfigSuccess = (
  state: AdminCoreState,
  payload: ReturnType<typeof AdminCoreActions.loadApplicationConfigSuccess>,
): AdminCoreState => ({
  ...state,
  applicationConfigLoadStatus: LoadingStateEnum.LOADED,
  componentsConfig: payload.componentsConfig,
  styleConfig: payload.styleConfig,
});

const onLoadApplicationConfigFailed = (
  state: AdminCoreState,
): AdminCoreState => ({
  ...state,
  applicationConfigLoadStatus: LoadingStateEnum.FAILED,
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

const onUpdateStyleConfig = (
  state: AdminCoreState,
  payload: ReturnType<typeof AdminCoreActions.updateStyleConfig>,
): AdminCoreState => {
  if (!state.styleConfig) {
    return {
      ...state,
      styleConfig: payload.config,
    };
  }
  return {
    ...state,
    styleConfig: {
      ...state.styleConfig,
      ...payload.config,
    },
  };
};

const adminCoreReducerImpl = createReducer<AdminCoreState>(
  initialAdminCoreState,
  on(AdminCoreActions.setApplicationId, onSetApplicationId),
  on(AdminCoreActions.loadApplicationConfig, onLoadApplicationConfig),
  on(AdminCoreActions.loadApplicationConfigSuccess, onLoadApplicationConfigSuccess),
  on(AdminCoreActions.loadApplicationConfigFailed, onLoadApplicationConfigFailed),
  on(AdminCoreActions.setSelectedComponent, onSetSelectedComponent),
  on(AdminCoreActions.updateComponentConfig, onUpdateComponentConfig),
  on(AdminCoreActions.updateStyleConfig, onUpdateStyleConfig),
);
export const adminCoreReducer = (state: AdminCoreState | undefined, action: Action) => adminCoreReducerImpl(state, action);
