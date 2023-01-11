import { inject, Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppStylingModel, ComponentModel } from '@tailormap-viewer/api';

@Injectable({
  providedIn: 'root',
})
export class ApplicationDetailsService {

  private httpClient = inject(HttpClient);
  private COMPONENTS_CONFIG_KEY = 'components';
  private APPLICATION_STYLING_CONFIG_KEY = 'application_style';

  private getApplicationId() {
    const appId = (window as any).currentApplicationId;
    if (typeof appId === 'undefined') {
      throw new Error('No application id found');
    }
    return +(appId);
  }

  public getComponentsConfig$(): Observable<ComponentModel[]> {
    return this.getConfig$<ComponentModel[]>(this.COMPONENTS_CONFIG_KEY);
  }

  public updateComponentsConfig$(config: ComponentModel[]): Observable<boolean> {
    return this.updateConfig$<ComponentModel[]>(this.COMPONENTS_CONFIG_KEY, config);
  }

  public deleteComponentsConfig$(): Observable<boolean> {
    return this.deleteConfig$(this.COMPONENTS_CONFIG_KEY);
  }

  public getApplicationStyling$(): Observable<AppStylingModel> {
    return this.getConfig$<AppStylingModel>(this.APPLICATION_STYLING_CONFIG_KEY);
  }

  public updateApplicationStyling$(config: AppStylingModel): Observable<boolean> {
    return this.updateConfig$<AppStylingModel>(this.APPLICATION_STYLING_CONFIG_KEY, config);
  }

  public deleteApplicationStyling$(): Observable<boolean> {
    return this.deleteConfig$(this.APPLICATION_STYLING_CONFIG_KEY);
  }

  public getConfig$<T>(key: string): Observable<T> {
    return this.httpClient.get<T>('/admin/action/applicationdetail', {
      params: {
        application: this.getApplicationId(),
        key,
      },
    });
  }

  public updateConfig$<T>(key: string, config: T): Observable<boolean> {
    const body = new URLSearchParams({ value: JSON.stringify(config) });
    const url = [
      '/admin/action/applicationdetail',
      `?application=${this.getApplicationId()}`,
      `&key=${key}`,
    ].join('');
    return from(fetch(url, { method: 'POST', body }).then((response) => response.ok));
  }

  public deleteConfig$(key: string): Observable<boolean> {
    const body = new URLSearchParams({ value: '' });
    const url = [
      '/admin/action/applicationdetail',
      `?application=${this.getApplicationId()}`,
      `&key=${key}`,
    ].join('');
    return from(fetch(url, { method: 'POST', body }).then((response) => response.ok));
  }

}
