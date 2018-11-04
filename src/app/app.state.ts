import { Injectable } from '@angular/core';
import { ENVIRONMENT } from '../environments/environment';

export type InternalStateType = {
  [key: string]: any,
};

declare let siteSettingsData: any;

/**
 * AppStateService is used to get common global settings from EPI that affects the whole site.
 * It is dependant on the IAngularAppInitializationConfig from BackendModels.Application.
 * To access the current AppState one should subscribe to the public appState variable.
 * Observable<any>
 * @example
 *  this.appStateService.appState.subscribe((state) => {});
 */
@Injectable()
export class AppState {

  public _state: InternalStateType = {};

  constructor() {
    /* Preloaded site common settings */
    if (typeof siteSettingsData !== 'undefined') {
      this._state = siteSettingsData;
      /* Always remove except in HMR mode */
      if (!ENVIRONMENT.HMR) {
        siteSettingsData = undefined;
        document.body.removeChild(document.getElementById('data-site-settings'));
      }
    }
  }

  /**
   * Already return a clone of the current state.
   */
  public get state() {
    return this._state = this._clone(this._state);
  }
  /**
   * Never allow mutation
   */
  public set state(value) {
    throw new Error('do not mutate the `.state` directly');
  }

  public get(prop?: any) {
    /**
     * Use our state getter for the clone.
     */
    const state = this.state;
    return state.hasOwnProperty(prop) ? state[prop] : null;
  }

  public set(prop: string, value: any) {
    /**
     * Internally mutate our state.
     */
    return this._state[prop] = value;
  }

  private _clone(object: InternalStateType) {
    /**
     * Simple object clone.
     */
    return JSON.parse(JSON.stringify(object));
  }
}
