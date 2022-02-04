import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NetworkRoutingModule } from './network-routing.module';
import { NetworkComponent } from './network.component';
import { GridComponent } from './grid/grid.component';
import { DetailComponent } from './detail/detail.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [NetworkComponent, GridComponent, DetailComponent],
  imports: [CommonModule, SharedModule, NetworkRoutingModule],
})
export class NetworkModule {}
