import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { ENVIRONMENT } from './environments/environment';

/* Global Styles */
import { hmrBootstrap } from './hmr';
import './styles/index.css';

if (!ENVIRONMENT.DEBUG) {
  enableProdMode();
}

const bootstrap = () => platformBrowserDynamic().bootstrapModule(AppModule);

if (ENVIRONMENT.HMR) {
  hmrBootstrap(module, bootstrap);
} else {
  bootstrap().catch(err => {
    throw err;
  });
}
