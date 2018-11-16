import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

test('renders markup to snapshot', () => {
  const fixture = TestBed.createComponent(AppComponent);
  expect(fixture).toMatchSnapshot();
});
