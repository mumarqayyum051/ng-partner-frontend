import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ErrorsComponent } from './errors/errors.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { LoaderComponent } from './loader/loader.component';
import { UploaderComponent } from './uploader/uploader.component';
import { FileUploadModule } from 'ng2-file-upload';
import { NoContentComponent } from './no-content/no-content.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SafePipe } from './pipes/safe.pipe';

const SHARED_MODULES = [
  CommonModule,
  FileUploadModule,
  ReactiveFormsModule,
  FormsModule,
  NgSelectModule,
  RouterModule,
  HttpClientModule,
  Ng2SearchPipeModule,
];
const SHARED_COMPONENTS = [ErrorsComponent, NoContentComponent, UploaderComponent, LoaderComponent];
const SHARED_PIPES = [SafePipe];
@NgModule({
  imports: SHARED_MODULES,
  exports: [SHARED_MODULES, SHARED_COMPONENTS, SHARED_PIPES],
  declarations: [SHARED_COMPONENTS, SHARED_PIPES],
})
export class SharedModule {}
