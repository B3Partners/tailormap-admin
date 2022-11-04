import { inject, Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ComponentsConfigModel } from '../models/components-config.model';

@Injectable({
  providedIn: 'root',
})
export class ApplicationDetailsService {

  private httpClient = inject(HttpClient);
  private COMPONENTS_CONFIG_KEY = 'components';

  private getApplicationId() {
    const appId = (window as any).currentApplicationId;
    if (typeof appId === 'undefined') {
      throw new Error('No application id found');
    }
    return +(appId);
  }

  public getComponentsConfig$(): Observable<ComponentsConfigModel> {
    return this.httpClient.get<ComponentsConfigModel>('/admin/action/applicationdetail', {
      params: {
        application: this.getApplicationId(),
        key: this.COMPONENTS_CONFIG_KEY,
      },
    });
  }

  public updateComponentsConfig$(config: ComponentsConfigModel): Observable<boolean> {
    const body = new URLSearchParams({ value: JSON.stringify(config) });
    const url = [
      '/admin/action/applicationdetail',
      `?application=${this.getApplicationId()}`,
      `&key=${this.COMPONENTS_CONFIG_KEY}`,
    ].join('');
    return from(fetch(url, { method: 'POST', body }).then((response) => response.ok));
  }

  public deleteComponentsConfig$(): Observable<boolean> {
    const body = new URLSearchParams({ value: '' });
    const url = [
      '/admin/action/applicationdetail',
      `?application=${this.getApplicationId()}`,
      `&key=${this.COMPONENTS_CONFIG_KEY}`,
    ].join('');
    return from(fetch(url, { method: 'POST', body }).then((response) => response.ok));
  }

}
