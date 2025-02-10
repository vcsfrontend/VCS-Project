//sig u .ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Component, input, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SwitherService } from '../../../../shared/services/swither.service';
import { NgbAccordionConfig, NgbAccordionModule, NgbCollapseModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { FirebaseService } from '../../../../shared/services/firebase.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Tools } from '../../../../shared/common/Enums/Tools';
import { CommonModule, DatePipe } from '@angular/common';
import flatpickr from 'flatpickr';
import { FlatpickrModule,FlatpickrDefaults  } from 'angularx-flatpickr';
import { ShowCodeContentDirective } from '../../../../shared/directives/show-code-content.directive';
import { BaseComponent } from '../../../../shared/base/base.component';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';
import { Title } from 'chart.js';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { NgbOffcanvas, OffcanvasDismissReasons,} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
// import { ShowcodeCardComponent } from '../../../shared/common/includes/showcode-card/showcode-card.component';

import { NgbDropdownModule, NgbNavModule, NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as prismCodeData from '../../../../shared/prismData/advancedUi/accordion';
//'../../../shared/prismData/advancedUi/accordion'
@Component({
  selector: 'app-basic',
  standalone: true,
  imports: [RouterModule,NgbModule,FormsModule,ReactiveFormsModule ,ToastrModule, MatIconModule,
    MatFormFieldModule, MatSelectModule, CommonModule, FlatpickrModule, OverlayscrollbarsModule, 
    NgbAccordionModule,NgbCollapseModule,ShowCodeContentDirective,NgSelectModule],
    // AngularFireModule,  AngularFireDatabaseModule, AngularFirestoreModule,
  providers: [FirebaseService,{ provide: ToastrService, useClass: ToastrService },FlatpickrDefaults, DatePipe],
  templateUrl: './basic.component.html',
  styleUrl: './basic.component.scss'
})
export class BasicComponent extends BaseComponent implements OnInit {
  prismCode = prismCodeData;
  selectedCountry: string = 'India'; city = '';
  selectedCountryCode: string = ''; phoneNumber = ''; 
  mobileNumber: string = ''; // Mobile number input
  isCollapsed = true;
  isCollapsed1 = true;
  isCollapsed2 = true;

  crm = false; submitted =false; cnfmPaswrd: any = ''; paswrd:any = ''; mailId:any = '';
  adonai = false; btnDisable = false; todayDt = new Date(); isBtnDsbl = false;
  adoanAiRole :any; isEmailDisabled = false; isOtpDisabled = false; isCompany : string = 'col-xl-6';
  crmRole :any; isShowUsers = false; pload:any[] = [];isOkBtn = false; showCity: boolean = true;

  toolsList = Object.keys(Tools).map(key => ({
    label: Tools[key as keyof typeof Tools],  // Display name
    value: key                                       // Enum key for binding
  }));

  //toolsList = [Tools.Adonai,Tools.Crm];
  @ViewChild('modalTemplate') modalTemplate!: TemplateRef<any>;
  private modalRef: any; noUsers:any=''; users:any = '';
  passwordStrengthMessage: string = '';
  passwordStrengthColor: string = '';
  confirmPasswordStrengthMessage: string = '';
  confirmPasswordStrengthColor: string = '';
  isPasswordValid: boolean = false; isPasswrd:boolean = false; isPassValid:boolean = false; 
  isCnfmPwd:boolean = false; agree: boolean = false; isResend:boolean = false; ref: string = '';
  isOtherOrReferral: boolean = false;

  icons = [
    { value: 'Individual', icon: 'home', name: 'Home' },
    { value: 'Enterprise', icon: 'settings', name: 'Settings' },
  ];

  signupFrm: FormGroup = this.fb.group({ 
    type : ['', Validators.required],
    companyName : ['', Validators.required],
    noOfUsers: [''],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required,  Validators.email]],
    country: ['India', Validators.required],
    dob: [new Date()],
    crm:false,
    adonai:false,
    phoneNumber: ['', Validators.required],
    username: [''],
    password: ['', [Validators.required, this.passwordValidator]],
    tools : [[],Validators.required],
    confirmPassword: ['', Validators.required],
    userFlag: ['signup'],
    city: ['', Validators.required],
    updatedBy: [''],
    reference: ['', Validators.required]
    //"toolId": 0,
    //"roleId": 0,
  })
  
  constructor(public fb: FormBuilder, public switchService: SwitherService, 
    private toastr: ToastrService, private router: Router, private dp: DatePipe,
     private modalService: NgbModal,  private viewContainerRef: ViewContainerRef,
     private offcanvasService: NgbOffcanvas, config: NgbAccordionConfig ){
    super();
    config.closeOthers = true;
    // document.body.classList.add('authentication-background');
    this.signupFrm.get('password')?.valueChanges.subscribe((value) => {
      this.checkPasswordStrength(value);
    });
    this.signupFrm.get('confirmPassword')?.valueChanges.subscribe((value) => {
      this.checkPasswordMatch(value);
    });
  }
  
  ngOnInit(){
    // this.f['password'].statusChanges.subscribe(() => {
    //   if (this.f['password'].touched && this.f['password'].invalid) {
    //     this.showPasswordError();
    //   }
    // });
    this.onTodayDt();
    this.onMinDate();    
  }

  ngOnDestroy(): void {
    // document.body.classList.remove('authentication-background');   
  }

  title = "intlInputNew" ;
  get f() {
    return this.signupFrm.controls;
  }

  onCountryChange(data:any) {
    data == 'India' ? (this.showCity = true) : (this.showCity = false , this.city = '');
    this.signupFrm.patchValue({ country: data});
    const cityFieldControl = this.signupFrm.get('city');
    if (data == 'India') {
      cityFieldControl?.setValidators([Validators.required])
    } else {
      cityFieldControl?.clearValidators()
    }
    cityFieldControl?.updateValueAndValidity(); 
  }

  // showPasswordError(): void {
  //   if (this.f['password'].errors?.['invalidPassword']) {
  //     this.toastr.error(
  //       'Password must be at least 8 characters long, contain one special character, one uppercase letter, one lowercase letter, and one number.',
  //       'Invalid Password'
  //     );
  //   } 
  // }

  // get password(): AbstractControl | null {
  //   return this.signupFrm.get('password');
  // }

  // get f(): { [key: string]: AbstractControl } { 
  //   return this.signupFrm.controls; 
  // }

  
  // ngAfterViewChecked() {
  //   console.log("60",this.signupFrm.get('tools'))
  // }
  
  passwordValidator(control: any) {
    const value = control.value;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasSpecialCharacter = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasMinLength = value.length >= 8;
    const valid = hasUpperCase && hasLowerCase && hasSpecialCharacter && hasNumber && hasMinLength;
    return valid ? null : { invalidPassword: true };
  }

  // passwordValidator(control: AbstractControl) {
  //   const password = control.value;
  //   const hasUpperCase = /[A-Z]/.test(password);
  //   const hasLowerCase = /[a-z]/.test(password);
  //   const hasNumber = /\d/.test(password);
  //   const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  //   const isValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  //   return isValid && password.length >= 8 ? null : { invalidPassword: true };
  // }

  // Check password strength and update the message and color dynamically
  checkPasswordStrength(password: string): void {
    this.cnfmPaswrd = '', this.confirmPasswordStrengthMessage = '', this.isCnfmPwd = false;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const lengthCriteria = password.length >= 8;

    // Calculate strength score
    let strength = 0;
    if (hasUpperCase) strength++;
    if (hasLowerCase) strength++;
    if (hasNumber) strength++;
    if (hasSpecialChar) strength++;
    if (lengthCriteria) strength++;
    if(strength == 0){
      this.passwordStrengthMessage = '';
      this.isPasswordValid = false;
    }

    // Determine message and color based on strength score
    if (strength == 0 && this.submitted == true) {
      this.passwordStrengthMessage = '';
      this.isPasswordValid = false;
    }
    else if (strength <= 2 && strength > 0) {
      this.passwordStrengthMessage = 'Password is Weak';
      this.passwordStrengthColor = 'red';
      this.isPasswordValid = false; this.isPasswrd = true; this.isPassValid = true;
    } else if (strength === 3 || strength === 4) {
      this.passwordStrengthMessage = 'Password is Medium';
      this.passwordStrengthColor = 'orange';
      this.isPasswordValid = false; this.isPasswrd = true; this.isPassValid = true;
    } else if (strength === 5) {
      this.passwordStrengthMessage = 'Password is Good';
      this.passwordStrengthColor = 'green';
      this.isPasswordValid = true; 
    }
  }

  checkPasswordMatch(password: string): void {
    if(this.paswrd != ''){
      // this.toastr.warning("please enter password first")
    // } else {
      if(this.paswrd != password && password != ''){
        this.isCnfmPwd = false;
        this.confirmPasswordStrengthMessage = 'Passwords not matched';
        this.confirmPasswordStrengthColor = 'red'
      } else if(this.paswrd == password){
        this.isCnfmPwd = true;
        this.confirmPasswordStrengthColor = 'green'
        this.confirmPasswordStrengthMessage = 'Passwords matched';
      } else if(password == ''){
        this.confirmPasswordStrengthMessage = '';
      }
    }
  }

  preventCopyPaste(event: ClipboardEvent): void {
    event.preventDefault();
    // alert('Copy, paste, and cut actions are disabled for security reasons.');
    // this.toastr.error('Copy, paste, and cut actions are disabled for security reasons.','signup', {
    //   timeOut: 3000, positionClass: 'toast-top-right' });
  }

  onReferenceChange(event:any){
    this.isOtherOrReferral = event.target.value === 'Other' || event.target.value === 'Referral';
  }

  onSignup(){
    this.submitted = true; this.isPasswrd = true; this.isPassValid = false;
    const crm = this.signupFrm.get('tools')?.value.includes('CRM');
    const adonai = this.signupFrm.get('tools')?.value.includes('Adonai');
    let payload = this.signupFrm.getRawValue();
    payload.type = +payload.type, 
    payload.noOfUsers = +this.users,
    payload.username = payload.firstName +' '+ payload.lastName,
    payload.crm = crm,
    payload.adonai = adonai,
    payload.phoneNumber = +payload.phoneNumber, delete payload.tools, delete payload.confirmPassword,
    payload.dob = this.dp.transform(payload.dob, 'dd-MM-yyyy'),
    payload.reference = (payload.reference == 'Referral' ? this.ref: (payload.reference == 'Other' ? this.ref : payload.reference))
    this.pload = payload
    console.log(payload);
    console.log( 's-',this.submitted, this.isOtherOrReferral, !this.ref);
    if (this.signupFrm.invalid) {
      this.toastr.error('Please fill mandatory fields');
      this.btnDisable = false;
        return;
    }
    else if(this.paswrd != this.cnfmPaswrd){
      this.toastr.error('password and confirm password not matched','signup', {
        timeOut: 3000,
        positionClass: 'toast-top-right',
      });
      return;
    }
    else if (this.agree == false) {
      this.toastr.error('Please agree to the terms and conditions!', 'Error');
    }
    else if (this.isOtherOrReferral && !this.ref){
      this.toastr.error('Please fill mandatory fields');
    }
    else{
      this.btnDisable = true;
      this.onMailCheck();
      // this.switchService.signupApi(payload).subscribe({ next: (res:any) => {
      //   if(res.status == true){
      //     this.toastr.success(res.message,'signup', {
      //       timeOut: 3000, positionClass: 'toast-top-right' });
      //     this.router.navigate(['auth/login'])
      //     } else {
      //       this.btnDisable = false;
      //       this.toastr.error(res.message,'signup', {
      //         timeOut: 3000, positionClass: 'toast-top-right' });
      //     }
      //   }
      // })
    }
  }

  onSignupApi(){
    this.switchService.signupApi(this.pload).subscribe({ next: (res:any) => {
      if(res.status == true){
        this.closeModal(), 
        this.toastr.success(res.message,'signup', {
          timeOut: 3000, positionClass: 'toast-top-right' });
        this.router.navigate(['auth/login'])
        } else {
          this.btnDisable = false;
          this.toastr.error(res.message,'signup', {
            timeOut: 3000, positionClass: 'toast-top-right' });
        }
      },
      error: (error) => {
        this.toastr.error(error.statusText);
      },
    })
  }

  onChng(event:any){
    let val = event.target.value
    this.noUsers = '';
    if (+val > 100 || +val < 2){
    this.users = '';
    this.toastr.warning('value should be in between 2 to 100 only','No. of Users', {
      timeOut: 3000, positionClass: 'toast-top-right' });
    }
    else
      this.users = +val;
  }

  onMailCheck(){
    if(this.mailId == ''){
      this.toastr.warning('Please Enter email','signup', {
        timeOut: 3000, positionClass: 'toast-top-right' });
    } else {
      this.switchService.onMailValidSignup(this.mailId).subscribe({ next: (res:any) => {
        if(res.status == true){
          if(this.isResend == false){
            this.openModal();
          } 
          this.btnDisable = true,
          this.signupFrm.get('email')?.disable();
          this.toastr.success(res.message,'signup', {
            timeOut: 3000, positionClass: 'toast-top-right' });
          } else {
            this.btnDisable = false;
            this.toastr.error(res.message,'signup', {
              timeOut: 3000, positionClass: 'toast-top-right' });
          }
        },
        error: (error) => {
          this.toastr.error(error.statusText);
          this.btnDisable = false;
        },
      })
    }
  }

  onClickButton() {
      this.openModal();  // Open the modal on successful response
  }

  openModal() {
    // Create an embedded view from the modal template
    this.modalRef = this.viewContainerRef.createEmbeddedView(this.modalTemplate);
  }

  closeModal() {
    // Destroy the modal view when closing
    if (this.modalRef) {
      this.modalRef.destroy();
      this.modalRef = null;
    }
  }

  onOtpCheck(){
    // this.isOtpDisabled = true;
    // this.btnDisable = false;
    // if(this.otp == ''){
    //   this.toastr.warning('Please Enter OTP','signup', {
    //     timeOut: 3000, positionClass: 'toast-top-right' });
    // } 
    const enteredOtp = this.otp.join('');
    // Check if OTP length is less than 6
    if (enteredOtp.length < 6) {
      this.isOtpValid = false;
      this.errorMessage = 'Please enter the complete OTP.';
      return;
    }
    else {
      this.switchService.onOtpSignup(this.mailId, enteredOtp).subscribe({ next: (res:any) => {
        if(res.status == true){
        // this.btnDisable = false, this.isOtpDisabled = true, 
        this.isOkBtn = true; 
        this.onSignupApi();
          this.toastr.success(res.message,'signup', {
            timeOut: 3000, positionClass: 'toast-top-right' });
          } else {
            this.isOkBtn = false;
            this.toastr.error(res.message,'signup', {
              timeOut: 3000, positionClass: 'toast-top-right' });
          }
        },
        error: (error) => {
          this.toastr.error(error.statusText);
        },
      })
    }
  }

  onDropdownChange() {
    const cmpnyFieldControl = this.signupFrm.get('companyName');
    // const userFieldControl = this.signupFrm.get('noOfUsers');
    if (this.signupFrm.get('type')?.value === '2') {
      cmpnyFieldControl?.setValidators([Validators.required]),
      // userFieldControl?.setValidators([Validators.required]),
      // this.isCompany = 'col-xl-4',
      this.isCompany = 'col-xl-6',
      this.isShowUsers = true;
    } else {
      cmpnyFieldControl?.clearValidators(),
      // userFieldControl?.clearValidators(),
      // this.signupFrm?.get('noOfUsers')?.setValue(''),
      this.isCompany = 'col-xl-6';
      this.isShowUsers = false;
    }
    cmpnyFieldControl?.updateValueAndValidity(); 
    // userFieldControl?.updateValueAndValidity();
  }


  showPassword = false;
  showPassword1 = false;
  toggleClass = "off-line";
  toggleClass1 = "off-line";
  createpassword() {
    this.showPassword = !this.showPassword;
    if (this.toggleClass === "off-line") {
      this.toggleClass = "line";
    } else {
      this.toggleClass = "off-line";
    }
  }
  createpassword1() {
    this.showPassword1 = !this.showPassword1;
    if (this.toggleClass1 === "off-line") {
      this.toggleClass1 = "line";
    } else {
      this.toggleClass1 = "off-line";
    }
  }
  
  toolId(tool:string) {
    // console.log("51",tool,this.adonai,this.crm);
  }
  otpArray = Array(6).fill(null);
  otp: string[] = Array(this.otpArray.length).fill('');
  isOtpValid = true;
  errorMessage = ''; 
  onInputChange(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    this.otp[index] = input.value;

    if (input.value && index < this.otpArray.length - 1) {
      (document.querySelectorAll('.otp-container input')[index + 1] as HTMLInputElement)?.focus();
    }
  }

  onKeydown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && index > 0 && !this.otp[index]) {
      (document.querySelectorAll('.otp-container input')[index - 1] as HTMLInputElement)?.focus();
    }
  }
  open() {
    this.modalService.open( {
      backdrop: 'static', // Disable close on clicking outside
      keyboard: false , centered: true 
    });
  }
  openTop(content: any) {
    this.offcanvasService.open(content, { position: 'top' });
  }
  openRight(content: any) {
    this.offcanvasService.open(content, { position: 'end' });
  }

  openBottom(content: any) {
    this.offcanvasService.open(content, { position: 'bottom' });
  }
  
}