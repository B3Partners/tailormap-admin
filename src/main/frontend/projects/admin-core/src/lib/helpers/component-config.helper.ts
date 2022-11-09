import { ComponentBaseConfigModel } from '@tailormap-viewer/api/lib/models/component-base-config.model';

export class ComponentConfigHelper {

  public static getBaseConfig(): ComponentBaseConfigModel {
    return {
      enabled: true,
    };
  }

}
