import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FileItem, FileUploader } from 'ng2-file-upload';
import { finalize } from 'rxjs';
import { environment } from '../../environments/environment';
import Swal from 'sweetalert2';
import { HOBBIES } from '../@constants/hobbies';
import { INDUSTRY_INTERESTS } from '../@constants/industryInterest';
import { PARTNEUR_STATUS } from '../@constants/partnerStatus';
import { SKILLS } from '../@constants/skills';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  public uploader: FileUploader = new FileUploader({
    url: `${environment.file_url}`,
  });
  showMain = false;
  showDetails = false;
  skills: any[] = SKILLS;
  partneur_Status: any[] = PARTNEUR_STATUS;
  isSubmit = false;
  industryInterest: any[] = INDUSTRY_INTERESTS;
  hobbies: any[] = HOBBIES;
  form: FormGroup;
  currentUser: any;
  isLoading = false;
  fileUploading = false;

  items = [{ name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }];

  users = [{ name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }];
  userId: any;
  url: any;
  base64textString: string | ArrayBuffer;
  currentRoute = localStorage.getItem('currentRoute');
  fileToBeUploaded: FileItem;
  constructor(private userService: UserService, private fb: FormBuilder) {
    this.onResize(null);
  }

  ngOnInit(): void {
    this.setUploader();

    this.currentUser = this.userService.getCurrentUser();
    localStorage.setItem('currentRoute', 'Profile');

    this.create();

    this.form.patchValue(this.currentUser);
    this.url = this.f.image.value;
  }
  setUploader() {
    // console.log(this.uploader);

    this.uploader.onAfterAddingFile = (file) => {
      file.onSuccess = (res: any) => {
        console.log(res);
        console.log(environment.file_url + '/' + JSON.parse(res).url);
      };
    };
  }
  create() {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [''],
      newPassword: ['', Validators.minLength(6)],
      confirmNewPassword: ['', Validators.minLength(6)],
      hobbies: [''],
      industryInterest: [''],
      skills: [''],
      partneurStatus: [''],
      bio: [''],
      designation: [''],
      image: [''],
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (window.innerWidth < 768) {
      this.showMain = true;
      this.showDetails = false;
    } else {
      this.showMain = true;
      this.showDetails = true;
    }
  }
  onSubmit() {
    this.isSubmit = true;
    if (this.f.newPassword.value && this.f.confirmNewPassword.value) {
      if (this.f.newPassword.value.length < 6 && this.f.confirmNewPassword.value.length < 6) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Password must be at least 6 characters long',
        });
        return;
      }
    }
    if (this.form.invalid) {
      return;
    }
    if (this.form.value.newPassword !== this.form.value.confirmNewPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Password does not match',
      });
      return;
    }
    if (!this.f.newPassword.value && !this.f.confirmNewPassword.value) {
      this.form.patchValue({ newPassword: '' });
    }
    this.isLoading = true;
    console.log(this.form.value);
    this.userService.updateProfile(this.form.value, this.currentUser._id).subscribe(
      (response) => {
        this.currentUser = this.userService.getCurrentUser();
        Swal.fire('Profile Updated', '', 'success');
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        Swal.fire('Error', '', 'error');
      }
    );
    //     this.isSubmit = true;

    //     if (this.form.invalid) {
    //       return;
    //     }
    //     this.isLoading = true;
    //     this.uploader.queue.push(this.fileToBeUploaded);
    //     this.fileToBeUploaded.upload();
    //     this.uploader.onErrorItem = (item, response, status, headers) => {};
    //     this.uploader.onSuccessItem = (item, response, status, headers) => {
    //       console.log(response);
    //       console.log(JSON.parse(response).url);
    //       this.userService.updateProfile(this.form.value, this.currentUser._id).subscribe(
    //         (response) => {
    //           this.currentUser = this.userService.getCurrentUser();
    //           this.isLoading = false;
    //           Swal.fire('Profile Updated', '', 'success');
    //         },
    //         (error) => {
    //           this.isLoading = false;
    //           Swal.fire('Error', '', 'error');
    //         }
    //       );
    //     };
  }
  toggle() {
    if (this.showMain && this.showDetails) return;
    this.showDetails = !this.showDetails;
    this.showMain = !this.showMain;
  }
  get f() {
    return this.form.controls;
  }

  onClickProfilePicture() {
    document.getElementById('file1').click();
  }

  onFileChange(event: any) {
    this.fileToBase64(event);
  }

  fileToBase64(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      this.base64textString = await reader.result;

      this.form.patchValue({ image: this.base64textString });
      this.url = this.base64textString;
      return reader.result;
    };
  }
  onFileSelect(event) {
    this.fileUploading = true;
    const _file = event.target.files[0];
    const fileName = _file.name;
    const data = new FormData();
    data.append("file", event.target.files[0]);
    this.userService.uploadFile(data).subscribe(
      (response) => {
        this.fileUploading = false;
        if (response.url) {
          this.form.patchValue({ image: response.url });
        }
      },
      (error) => {
        this.fileUploading = false;
        Swal.fire('Error:' + error, '', 'error');
      }
    );
    const reader = new FileReader();
    reader.readAsDataURL(_file);
    reader.onload = async () => {
      this.base64textString = await reader.result;
      // console.log(this.base64textString);
      let file = new File([this.dataURItoBlob(reader.result)], fileName, {
        type: 'image/jpg',
      });
      this.fileToBeUploaded = new FileItem(this.uploader, file, {});
    };
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
  onCancel() {
    this.form.patchValue(this.currentUser);
  }
}