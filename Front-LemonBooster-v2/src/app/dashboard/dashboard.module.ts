





/* MODULES */
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from './../components/components.module';

/* COMPONENTS */
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutes } from './dashboard-routing.module';


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    RouterModule.forChild(DashboardRoutes),
    ComponentsModule
  ]
})

export class DashboardModule { }
