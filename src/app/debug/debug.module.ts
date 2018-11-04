import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgCoreModule } from '@evry/ng-core';

import { DebugComponent } from './debug.component';

import { NgModule } from '@angular/core';

const DECLARATION: any[] = [
  DebugComponent,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgCoreModule,
  ],
  declarations: DECLARATION,
  exports: DECLARATION,
  entryComponents: DECLARATION,
})
export class DebugModule { }
