import {
  Component,
  ComponentFactoryResolver,
  HostBinding,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { IRouteAlias, ModalComponent, RouterX } from '@evry/ng-core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { ENVIRONMENT } from '../environments/environment';

/* SPECIAL CASE */
import { AppState } from './app.state';
import { DebugComponent } from './debug/debug.component';

declare let VERSION: string;
declare let routingAliasData: IRouteAlias;

@Component({
  selector: 'c-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @HostBinding('attr.app-version') version = VERSION;

  @ViewChild('debugRef', { read: ViewContainerRef }) debugRef: ViewContainerRef;

  @ViewChild('modalRef') modalRef: ModalComponent;

  private subs: Subscription[] = [];

  constructor(
    private router: Router,
    private translateService: TranslateService,
    private componentResolver: ComponentFactoryResolver,
    public appState: AppState,
  ) {
    this.translateService.setDefaultLang('sv');
    this.translateService.use('sv');

    if (
      ENVIRONMENT.DEBUG &&
      typeof sessionStorage.getItem('debug.language') === 'string'
    )
      this.translateService.use(sessionStorage.getItem('debug.language'));

    /* Preloaded routing alias */
    if (typeof routingAliasData !== 'undefined') {
      this.router.resetConfig(
        RouterX.AddRouteAlias(this.router.config, routingAliasData),
      );
      /* Always remove except in HMR mode */
      if (!ENVIRONMENT.HMR) {
        routingAliasData = undefined;
        document.body.removeChild(
          document.getElementById('data-routing-alias'),
        );
      }
    }
  }

  ngOnInit() {
    if (ENVIRONMENT.DEBUG) this.addDebugComponent();
  }

  addDebugComponent() {
    this.debugRef.createComponent(
      this.componentResolver.resolveComponentFactory(DebugComponent),
    );
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
