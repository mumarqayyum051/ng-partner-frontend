import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FileItem, FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css'],
})
export class UploaderComponent implements OnInit {
  uploader: FileUploader = new FileUploader({
    url: `${environment.apiUrl}/api/upload`,
  });
  @ViewChild('input') input!: ElementRef;
  @Input() multiple = true;
  @Input() single = true;
  @Input() accept = 'image/*';
  @Output() output = new EventEmitter<any>();
  // 1- return image url after uploading file
  //2- return base64 String URL and not upload the file in uploads folder
  //3- return file object
  @Input() outputType: any = [1, 2, 3];
  imgView = null;
  base64textString: any;
  fileName: any;
  fileExtension: any;
  fileToBeUploaded: any;
  fileObject!: File;

  constructor() {}

  ngOnInit() {}

  click() {
    this.input.nativeElement.click();
  }
  onFileSelected(event: any) {
    this.fileObject = event;
    // this.onFileChange(event);
    this.fileName = event.target.files[0].name;
    // this.fileExtension = event.target.files[0].name.split('.')[1];

    // fileNameWithExtension.split('[.]', 0);

    this.fileToBase64(event);
    this.fileToFileItem(event);
  }
  upload() {
    if (this.outputType === 1) {
      this.uploader.queue.push(this.fileToBeUploaded);
      this.fileToBeUploaded.upload();
      this.uploader.onErrorItem = (item, response, status, headers) => {};
      this.uploader.onSuccessItem = (item, response, status, headers) => {
        this.output.emit(JSON.parse(response).url);
        this.imgView = JSON.parse(response).url;
      };
    } else if (this.outputType === 2) {
      this.imgView = this.base64textString;
      this.output.emit(this.base64textString);
    } else if (this.outputType === 3) {
      this.output.emit(this.fileObject);
    }
  }

  dataURItoBlob(dataURI: any): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    const ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpg' });
  }

  fileToBase64(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      this.base64textString = await reader.result;

      return reader.result;
    };
  }
  fileToFileItem(event: any) {
    const _file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(_file);
    reader.onload = async () => {
      this.base64textString = await reader.result;

      let file = new File([this.dataURItoBlob(reader.result)], this.fileName, {
        type: 'image/jpg',
      });
      this.fileToBeUploaded = new FileItem(this.uploader, file, {});
    };
  }
}
