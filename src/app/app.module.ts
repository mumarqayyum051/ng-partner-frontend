import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { UserService } from './core/services/user.service';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent, LayoutComponent, HeaderComponent],
  imports: [CommonModule, BrowserModule, SharedModule, CoreModule, AppRoutingModule, NgbModule],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (us: UserService) =>
        function () {
          return new Promise((resolve, reject) => {
            us.contextPopulate().subscribe(
              (user: any) => {
                resolve(true);
              },
              (error) => resolve(error)
            );
          });
        },
      deps: [UserService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
