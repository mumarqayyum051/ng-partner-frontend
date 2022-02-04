import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  isTermsAccepted: boolean = false;
  isAgeCertified: boolean = false;
  isSubmit: boolean = false;
  error = '';
  isLoading = false;
  termsAndAge = '';
  shareUrl = 'https://partneur.com/';
  title = 'Partneur';
  desc = 'A Tool For Creating Unique Idea';
  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.create();
  }
  create() {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      affiliateCode: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  onSubmit() {
    this.error = '';
    this.termsAndAge = '';
    this.isSubmit = true;
    if (this.form.invalid) {
      return;
    }
    if (this.f.affiliateCode && this.f.affiliateCode.value === '') {
      this.form.removeControl('affiliateCode');
    }
    if (!this.isTermsAccepted || !this.isAgeCertified) {
      this.termsAndAge = 'Please accept the terms and age certifications';
      return;
    }
    if (this.f.password.value !== this.f.confirmPassword.value) {
      this.error = 'Password and confirm password does not match';
      return;
    }
    this.isLoading = true;
    this.userService.signUp(this.form.value).subscribe(
      (response) => {
        if (response.token && response.token !== null) {
          this.router.navigate(['/connect']);
          this.isSubmit = false;
          this.isLoading = false;

          this.termsAndAge = '';
          this.router.navigate(['/connect']);
        }
      },
      (err) => {
        this.isLoading = false;

        this.error = err.message;

        this.isSubmit = false;
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
