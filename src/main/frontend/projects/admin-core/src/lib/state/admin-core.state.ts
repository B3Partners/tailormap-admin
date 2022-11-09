import { LoadingStateEnum } from '@tailormap-viewer/shared';
import { ComponentModel } from '@tailormap-viewer/api';

export const adminCoreStateKey = 'adminCore';

export interface AdminCoreState {
  componentsConfigLoadStatus: LoadingStateEnum;
  componentsConfig?: ComponentModel[];
  selectedComponent?: string;
  applicationId?: number;
}

export const initialAdminCoreState: AdminCoreState = {
  componentsConfigLoadStatus: LoadingStateEnum.INITIAL,
};
