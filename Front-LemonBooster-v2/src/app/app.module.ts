




/* MODULES */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io'; //Sockets 
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { PagesModule } from './pages/pages.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ComponentsModule } from './components/components.module';
import { FormsModule } from '@angular/forms';

/* COMPONENTS */
import { AppComponent } from './app.component';

/* CONFIG */
import { environment } from 'src/environments/environment';


const config: SocketIoConfig = { 
  url: environment.wsUrl, options: {} 
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config),
    RouterModule,
    PagesModule,
    ComponentsModule,
    DashboardModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
