import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConnectRoutingModule } from './connect-routing.module';
import { ConnectComponent } from './connect.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [ConnectComponent],
  imports: [CommonModule, SharedModule, ConnectRoutingModule],
})
export class ConnectModule {}
