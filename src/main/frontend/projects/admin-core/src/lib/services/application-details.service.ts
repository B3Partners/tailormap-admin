import { inject, Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ComponentModel } from '@tailormap-viewer/api';

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

  public getComponentsConfig$(): Observable<ComponentModel[]> {
    return this.httpClient.get<ComponentModel[]>('/admin/action/applicationdetail', {
      params: {
        application: this.getApplicationId(),
        key: this.COMPONENTS_CONFIG_KEY,
      },
    });
  }

  public updateComponentsConfig$(config: ComponentModel[]): Observable<boolean> {
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
