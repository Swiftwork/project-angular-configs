import {
  Location,
  LocationStrategy,
  PathLocationStrategy,
  registerLocaleData,
} from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import localeSv from '@angular/common/locales/sv';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgComponentsModule } from '@evry/ng-components';
import { NgCoreModule } from '@evry/ng-core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { APP_ROUTES, APP_ROUTING_PROVIDERS } from './app.routing';
import { AppState } from './app.state';
import { DebugModule } from './debug/debug.module';

/* LANGUAGES */
registerLocaleData(localeSv, 'sv');

declare let VERSION: string;

export function TranslateLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    `${process.env.PUBLIC_PATH}i18n/`,
    `.json?version=${VERSION}`,
  );
}

@NgModule({
  imports: [
    /* @ANGULAR */
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: TranslateLoaderFactory,
        deps: [HttpClient],
      },
    }),

    /* @EVRY */
    NgCoreModule.forRoot(),
    NgComponentsModule.forRoot(),

    /* Project */
    RouterModule.forRoot(APP_ROUTES),
    DebugModule,
  ],

  declarations: [AppComponent],

  /* Needed only for dynamic component creation such as dialogs and other containers */
  entryComponents: [
    // CONTAINER_DECLARATIONS,
    // INTERACTIVE_DECLARATIONS,
    // PRESENTATIONAL_DECLARATIONS,
    // COMPONENTS_DECLARATIONS,
  ],

  providers: [
    AppState,
    /* LOCALE */
    {
      provide: LOCALE_ID,
      useValue: 'sv-SE',
    },
    /* Location Strategy */
    Location,
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy,
    },
    APP_ROUTING_PROVIDERS,
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
