import { Component, HostBinding, OnInit } from '@angular/core';
import { IOption } from '@evry/ng-core';
import { TranslateService } from '@ngx-translate/core';

import { ENVIRONMENT } from '../../environments/environment';

@Component({
  selector: 'c-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.css'],
})
export class DebugComponent implements OnInit {

  public users: IOption<string, string>[] = [
    { key: 'Anonymous', label: 'Anonymous' },
    { key: 'New', label: 'New User' },
    { key: 'Small', label: 'Small User' },
    { key: 'Large', label: 'Large User' },
  ];

  public languages: IOption<string, string>[] = [
    { key: 'sv', label: 'Swedish' },
    { key: 'en', label: 'English' },
  ];

  @HostBinding('attr.aria-expanded')
  public expanded = false;
  public language = 'sv';
  public api = ENVIRONMENT.API.PATH;
  public scenario = ENVIRONMENT.API.SCENARIO;
  public user = ENVIRONMENT.API.USER;
  public customer = ENVIRONMENT.API.USER;
  public delay = ENVIRONMENT.API.DELAY;
  public live = ENVIRONMENT.API.LIVE;

  constructor(
    private translateService: TranslateService,
  ) { }

  ngOnInit() {
    const expanded = sessionStorage.getItem('debug.expanded');
    const language = sessionStorage.getItem('debug.language');
    const api = sessionStorage.getItem('debug.api');
    const scenario = sessionStorage.getItem('debug.scenario');
    const user = sessionStorage.getItem('debug.user');
    const customer = sessionStorage.getItem('debug.customer');
    const delay = sessionStorage.getItem('debug.delay');
    const live = sessionStorage.getItem('debug.live');

    if (expanded !== null) this.expanded = expanded === 'true';
    if (language !== null) this.language = language;
    if (api !== null) this.api = api;
    if (scenario !== null) this.scenario = scenario;
    if (user !== null) this.user = user.split('/')[3];
    if (customer !== null) this.customer = customer;
    if (delay !== null) this.delay = parseInt(delay, 10);
    if (live !== null) this.live = live === 'true';

    this.onSettingsUpdate('expanded', this.expanded);
    this.onSettingsUpdate('language', this.language);
    this.onSettingsUpdate('api', this.api);
    this.onSettingsUpdate('scenario', this.scenario);
    this.onSettingsUpdate('user', this.user);
    this.onSettingsUpdate('delay', this.delay);
    this.onSettingsUpdate('live', this.live);
  }

  onSettingsUpdate(key: string, value: any) {
    if (key === 'user') {
      sessionStorage.setItem(`debug.customer`, `/api/Customers/${value}`);
      value = `/api/Users/${value}`;
    }

    if (key === 'language')
      this.translateService.use(value);

    sessionStorage.setItem(`debug.${key}`, value);
  }

  refresh() {
    window.location.reload();
  }
}
