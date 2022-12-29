import { LoadingStateEnum } from '@tailormap-viewer/shared';
import { AppStylingModel, ComponentModel } from '@tailormap-viewer/api';

export const adminCoreStateKey = 'adminCore';

export interface AdminCoreState {
  applicationConfigLoadStatus: LoadingStateEnum;
  componentsConfig?: ComponentModel[];
  selectedComponent?: string;
  styleConfig?: AppStylingModel;
  applicationId?: number;
}

export const initialAdminCoreState: AdminCoreState = {
  applicationConfigLoadStatus: LoadingStateEnum.INITIAL,
};
