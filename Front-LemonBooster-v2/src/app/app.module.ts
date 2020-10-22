




/* MODULES */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io'; //Sockets 
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { PagesModule } from './pages/pages.module';
import { ComponentsModule } from './components/components.module';
import { FormsModule } from '@angular/forms';
import { AuthModule } from './auth/auth.module';

/* COMPONENTS */
import { AppComponent } from './app.component';

/* CONFIG */
import { environment } from 'src/environments/environment';


const config: SocketIoConfig = { 
  url: `http://${localStorage.getItem('IpVPS')}:5000`, options: {} 
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
    AuthModule,
    ComponentsModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
