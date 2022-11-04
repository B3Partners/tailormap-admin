import { ComponentsConfigModel } from '../models/components-config.model';
import { LoadingStateEnum } from '@tailormap-viewer/shared';

export const adminCoreStateKey = 'adminCore';

export interface AdminCoreState {
  componentsConfigLoadStatus: LoadingStateEnum;
  componentsConfig?: ComponentsConfigModel;
  selectedComponent?: string;
  applicationId?: number;
}

export const initialAdminCoreState: AdminCoreState = {
  componentsConfigLoadStatus: LoadingStateEnum.INITIAL,
};
