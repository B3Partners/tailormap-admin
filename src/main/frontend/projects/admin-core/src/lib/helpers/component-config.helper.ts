import { ComponentModel } from '@tailormap-viewer/api';

export class ComponentConfigHelper {

  public static getBaseConfig(type: string): ComponentModel {
    return {
      type,
      config: { enabled: true },
    };
  }

}
