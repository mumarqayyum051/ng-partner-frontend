import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  form!: FormGroup;
  isSubmit: boolean = false;
  error = '';
  token: string = '';
  message = '';
  isLoading = false;
  shareUrl = 'https://partneur.com/';
  title = 'Partneur';
  desc = 'A Tool For Creating Unique Idea';
  constructor(private fb: FormBuilder, private userService: UserService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
    this.reset();
  }

  reset() {
    this.form = this.fb.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  onSubmit() {
    this.error = '';
    this.message = '';
    this.isSubmit = true;
    if (this.form.invalid) {
      return;
    }
    if (this.f.password.value !== this.f.confirmPassword.value) {
      this.error = 'Password and confirm password does not match';
      return;
    }
    this.isLoading = true;
    this.form.value.token = this.token;
    this.userService.resetPassword(this.form.value).subscribe(
      (response) => {
          if (response.result) {
            this.message = 'Password Reset Successful.';
            setTimeout(() => {
              this.router.navigate(['/auth']);
            }, 1000);
          }
          this.isSubmit = false;
          this.isLoading = false;
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
