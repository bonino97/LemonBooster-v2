
/* MODULES */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ComponentsModule } from './../components/components.module';
import { TooltipModule } from "ngx-bootstrap/tooltip";

/* COMPONENTS */
import { LoginComponent } from './login/login.component';
import { NewProgramComponent } from './new-program/new-program.component';
import { ProgramsComponent } from './programs/programs.component';
import { ProgramUrlComponent } from './program-url/program-url.component';
import { EditProgramComponent } from './edit-program/edit-program.component';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';



@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: "never" }),
    HttpClientModule,
    ComponentsModule,
    TooltipModule.forRoot(),
  ],
  declarations: [
    LoginComponent,
    NewProgramComponent,
    ProgramsComponent,
    ProgramUrlComponent,
    EditProgramComponent,
    ComingSoonComponent
  ],
  exports: [
  ]
})

export class PagesModule {}
