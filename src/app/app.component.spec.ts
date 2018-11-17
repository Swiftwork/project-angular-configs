import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { APP_ROUTES } from './app.routing';
import { AppState } from './app.state';
import { DebugComponent } from './debug/debug.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes(APP_ROUTES),
      ],
      declarations: [AppComponent, DebugComponent],
      providers: [AppState],
      schemas: [NO_ERRORS_SCHEMA],
    });
    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [DebugComponent],
      },
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should render markup that match snapshot', () => {
    expect(fixture).toMatchSnapshot();
  });

  it('should dynamically add the debug controller', () => {
    const controller = fixture.debugElement.nativeElement.querySelector(
      'c-debug',
    );
    const trigger = controller.querySelector('.trigger');
    trigger.click();
    fixture.detectChanges();
    expect(controller.getAttribute('aria-expanded')).toBe('true');
  });
});
