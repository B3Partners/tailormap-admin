import { BaseComponentConfigModel } from '../models/base-component-config.model';

export class ComponentConfigHelper {

  public static getBaseConfig(type: string): BaseComponentConfigModel {
    return {
      type,
      enabled: true,
    };
  }

}
