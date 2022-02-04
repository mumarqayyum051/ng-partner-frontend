import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  isSubmit: boolean;
  isLoading = false;
  error = '';
  shareUrl = 'https://partneur.com/';
  title = 'Partneur';
  desc = 'A Tool For Creating Unique Idea';
  cookieExists: boolean;
  cookieValue: any;
  constructor(
    private cookieService: CookieService,
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.create();
    this.cookieExists = this.cookieService.check('partneur');
    let rememberCook;
    if (this.cookieExists) {
      rememberCook = this.cookieService.get('partneur');
      let values = JSON.parse(atob(rememberCook));
      this.cookieValue = {
        email: values.email,
        password: values.password,
        rememberMe: true,
      };
      this.form.patchValue(this.cookieValue);
    }
  }
  create() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [''],
    });
  }
  onSubmit() {
    this.isSubmit = true;
    this.error = '';

    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.cookieExists) {
      if (this.cookieValue.email != this.f.email.value || this.cookieValue.password != this.f.password.value) {
        this.cookieExists = false;
      }
    }
    this.userService.attemptAuth(this.form.value, this.cookieExists).subscribe(
      (response) => {
        if (response.token && response.token !== '') {
          this.error = '';
          this.isLoading = false;

          this.router.navigate(['/connect']);
        }
      },
      (error) => {
        this.error = error;
        this.isLoading = false;
      }
    );
  }
  get f() {
    return this.form.controls;
  }
  shareOnFacebook(shareUrl: string) {
    shareUrl = encodeURIComponent(shareUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, 'sharer', 'width=600,height=600');
  }

  shareOnTwitter(shareUrl: string, desc: string) {
    shareUrl = encodeURIComponent(shareUrl);
    desc = encodeURIComponent(desc);
    window.open(`https://twitter.com/intent/tweet?url=${shareUrl}&text=${desc}`, 'sharer', 'width=650,height=600');
  }

  shareOnLinkedIn(shareUrl: string, title: string, summary: string) {
    shareUrl = encodeURIComponent(shareUrl);
    window.open(
      `https://www.linkedin.com/shareArticle?url=${shareUrl}&title=${title}&summary=${summary}`,
      'sharer',
      'width=650,height=600'
    );
  }

  shareOnInstagram(shareUrl: string, title: string) {
    shareUrl = encodeURIComponent(shareUrl);
    window.open(`https://instagram.com/partneur?utm_medium=copy_link/`, 'sharer', 'width=650,height=600');
  }
}
