
/* MODULES */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ComponentsModule } from './../components/components.module';
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { NgxLoadingModule } from 'ngx-loading';
import { PagesRoutingModule } from './pages-routing.module';

/* COMPONENTS */
import { NewProgramComponent } from './new-program/new-program.component';
import { ProgramsComponent } from './programs/programs.component';
import { ProgramUrlComponent } from './program-url/program-url.component';
import { EditProgramComponent } from './edit-program/edit-program.component';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { DocsComponent } from './docs/docs.component';
import { PagesComponent } from './pages.component';
import { SettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './profile/profile.component';



@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: "never" }),
    PagesRoutingModule,
    HttpClientModule,
    ComponentsModule,
    TooltipModule.forRoot(),
    NgxLoadingModule
  ],
  declarations: [
    NewProgramComponent,
    ProgramsComponent,
    ProgramUrlComponent,
    EditProgramComponent,
    ComingSoonComponent,
    DocsComponent,
    PagesComponent,
    SettingsComponent,
    ProfileComponent
  ],
  exports: [
  ]
})

export class PagesModule {}
