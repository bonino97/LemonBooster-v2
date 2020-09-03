
import { ToolsModule } from './../tools/tools.module';
import { RouterModule } from '@angular/router';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ModalModule } from "ngx-bootstrap/modal";


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProgramsNavbarComponent } from './programs-navbar/programs-navbar.component';
import { SeedsComponent } from './seeds/seeds.component';
import { EnumerationComponent } from './enumeration/enumeration.component';
import { DiscoveryComponent } from './discovery/discovery.component';
import { MonitoringComponent } from './monitoring/monitoring.component';

@NgModule({
  declarations: [
    SidebarComponent,
    NavbarComponent,
    ProgramsNavbarComponent,
    SeedsComponent,
    EnumerationComponent,
    DiscoveryComponent,
    MonitoringComponent
  ],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    RouterModule,
    ToolsModule
  ],
  exports: [
    SidebarComponent,
    NavbarComponent,
    ProgramsNavbarComponent,
    SeedsComponent,
    EnumerationComponent,
    DiscoveryComponent,
    MonitoringComponent
  ]
})
export class ComponentsModule { }
