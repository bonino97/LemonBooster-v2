
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { NgxLoadingModule } from 'ngx-loading';

import { AcquisitionsComponent } from './acquisitions/acquisitions.component';
import { AsnsComponent } from './asns/asns.component';
import { CidrsComponent } from './cidrs/cidrs.component';
import { AmassComponent } from './amass/amass.component';
import { SubdomainsComponent } from './subdomains/subdomains.component';
import { AliveComponent } from './alive/alive.component';
import { ScreenshotsComponent } from './screenshots/screenshots.component';
import { JsscannerComponent } from './jsscanner/jsscanner.component';
import { ResponseCodesComponent } from './response-codes/response-codes.component';

@NgModule({
  declarations: [
    AcquisitionsComponent,
    AsnsComponent,
    CidrsComponent,
    AmassComponent,
    SubdomainsComponent,
    AliveComponent,
    ScreenshotsComponent,
    JsscannerComponent,
    ResponseCodesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: "never" }),
    TooltipModule.forRoot(),
    NgxLoadingModule.forRoot({})
  ],
  exports: [
    AcquisitionsComponent,
    AsnsComponent,
    CidrsComponent,
    AmassComponent,
    SubdomainsComponent,
    AliveComponent,
    ScreenshotsComponent,
    JsscannerComponent,
    ResponseCodesComponent
  ]
})
export class ToolsModule { }
