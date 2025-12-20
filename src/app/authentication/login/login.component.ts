import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AuthService } from '../../shared/services/auth.service';
import { FirebaseService } from '../../shared/services/firebase.service';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AppStateService } from '../../shared/services/app-state.service';
import { BehaviorSubject } from 'rxjs';
import { NavService } from '../../shared/services/navservice';
import { SwitherService } from '../../shared/services/swither.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule,NgbModule,FormsModule,ReactiveFormsModule ,AngularFireModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule,ToastrModule,
    // ToastrModule.forRoot({    // Toastr global settings
    //   timeOut: 3000,          // 3 seconds timeout
    //   positionClass: 'toast-top-right', // Position
    //   preventDuplicates: true // Prevent duplicate toasts
    // })
],
  
    providers: [FirebaseService,{ provide: ToastrService, useClass: ToastrService }],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  // public showPassword: boolean = false;

  // toggleClass = 'ri-eye-off-line';
  active="Angular"; btnDisable = false; userData :any;

  public togglePassword() {
    // this.showPassword = !this.showPassword;
    // if (this.toggleClass === 'ri-eye-line') {
    //   this.toggleClass = 'ri-eye-off-line';
    // } else {
    //   this.toggleClass = 'ri-eye-line';
    // }
}
disabled = '';
public localdata:any=this.appStateService;

constructor(
  @Inject(DOCUMENT) private document: Document,private elementRef: ElementRef,
 private sanitizer: DomSanitizer,
  public authservice: AuthService,
  private router: Router,
  private formBuilder: FormBuilder,
  private renderer: Renderer2,
  private firebaseService: FirebaseService,
  private toastr: ToastrService ,
  private appStateService: AppStateService,
  private navSvc : NavService,
  public switchService: SwitherService
) {
  // AngularFireModule.initializeApp(environment.firebase);

  // document.body.classList.add('authentication-background');
  // const htmlElement =
  // this.elementRef.nativeElement.ownerDocument.documentElement;
// htmlElement.removeAttribute('style');
  //User Tools
      this.userData = localStorage.getItem('userDetails');


}
ngOnInit(): void {
  this.loginForm = this.formBuilder.group({
    // username: ['spruko@admin.com', [Validators.required, Validators.email]],
    // password: ['sprukoadmin', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

}

ngOnDestroy(): void {
  const htmlElement =
this.elementRef.nativeElement.ownerDocument.documentElement;
  document.body.classList.remove('authentication-background');    

}
showPassword = false;
toggleClass = "off-line";
createpassword() {
  this.showPassword = !this.showPassword;
  if (this.toggleClass === "off-line") {
    this.toggleClass = "line";
  } else {
    this.toggleClass = "off-line";
  }
}
 firestoreModule = this.firebaseService.getFirestore();
 databaseModule = this.firebaseService.getDatabase();
 authModule = this.firebaseService.getAuth();
// firebase
email = '';
password = '';
errorMessage = ''; // validation _error handle
_error: { name: string; message: string } = { name: '', message: '' }; // for firbase _error handle

clearErrorMessage() {
  this.errorMessage = '';
  this._error = { name: '', message: '' };
}

login() {
  // this.disabled = "btn-loading"
  this.clearErrorMessage();
  // if (this.validateForm(this.email, this.password)) {
    // this.authservice
    //   .loginWithEmail(this.email, this.password)
    //   .then(() => {
    //     this.router.navigate(['/dashboard/sales']);
    //     console.clear();
    //     this.toastr.success('login successful','Udon', {
    //       timeOut: 3000,
    //       positionClass: 'toast-top-right',
    //     });
    //   })
    //   .catch((_error: any) => {
    //     this._error = _error;
    //     this.router.navigate(['/']);
    //   });
    this.btnDisable = true;
    this.authservice.login(this.email, this.password).subscribe({
      next: (res) => {
        // Redirect on successful login
      if (res.status == true) {
        this.toastr.success('login successful','VCS', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
        });
         localStorage.setItem(
          'loginPayload',
          JSON.stringify({
            email: this.loginForm.value.email,
            password: this.loginForm.value.password
          })
        );


        localStorage.setItem("username",res.username);
        localStorage.setItem("email",res.email);
        localStorage.setItem("adonaiRole", res.adonaiRole);
      localStorage.setItem("crmRole", res.crmRole);
          this.navSvc.isAdonaiApplicable$.next(res.adonai);
          this.navSvc.isCRMApplicable$.next(res.crm);
          this.navSvc.adonaiRole$.next(res.adonaiRole);
          this.navSvc.crmRole$.next(res.crmRole)
          this.switchService.userInfo(res.email).subscribe(() => {
            this.router.navigate(['/pages/profile']);
          });
        // this.router.navigate(['/pages/profile']);
      }
    else{
      this.toastr.error(res.message,'VCS', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
          this.btnDisable = false;
        }
        // this.glblSvc.onTstr(this.tstrTyp.error, r?.message);
      },
      error: () => {
        // this.errorMessage = 'Invalid username or password. Please try again';
        this.btnDisable = false;
        this.toastr.error('Invalid username or password','VCS', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
        });
      
      }
    });
   
  // }
  // else {
  //   this.toastr.error('Invalid details','Udon', {
  //     timeOut: 3000,
  //     positionClass: 'toast-top-right',
  //   });
  // }
}

validateForm(email: string, password: string) {
  if (email.length === 0) {
    this.errorMessage = 'please enter email id';
    return false;
  }

  if (password.length === 0) {
    this.errorMessage = 'please enter password';
    return false;
  }

  // if (password.length < 6) {
  //   this.errorMessage = 'password should be at least 6 char';
  //   return false;
  // }
 
  this.errorMessage = '';
  return true;
  
}

//angular
public loginForm!: FormGroup;
public error: any = '';

get form() {
  return this.loginForm.controls;
}

onSubmit() {
  if(this.loginForm.controls['email'].value == ''){
    this.errorMessage = 'please enter email id';
    this.toastr.warning(`Please enter username`, 'VCS',{
      timeOut: 3000,
      positionClass: 'toast-top-right',
    });
  }else if(this.loginForm.controls['password'].value == ''){
    this.toastr.warning(`Please enter password`,'VCS',{
      timeOut: 3000,
      positionClass: 'toast-top-right',
    });
  }
  else if (
    this.loginForm.controls['email'].value != '' &&
    this.loginForm.controls['password'].value != ''
  ) {
    this.login();
  //   this.router.navigate(['/dashboard/sales']);
  //   this.toastr.success('login successful','Udon', {
  //     timeOut: 3000,
  //     positionClass: 'toast-top-right',
  //   });
  // } else {
  //   this.toastr.error('Invalid details','Udon', {
  //     timeOut: 3000,
  //     positionClass: 'toast-top-right',
  //   });
  }
  

}
preventCopyPaste(event: ClipboardEvent): void {
  event.preventDefault();
  // alert('Copy, paste, and cut actions are disabled for security reasons.');
  // this.toastr.error('Copy, paste, and cut actions are disabled for security reasons.','signup', {
  //   timeOut: 3000, positionClass: 'toast-top-right' });
}

  onLoginSuccess(email: string) {
    this.switchService.loadUserAccess(email);
  }

}