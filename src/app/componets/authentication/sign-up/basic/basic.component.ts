import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SwitherService } from '../../../../shared/services/swither.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
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
@Component({
  selector: 'app-basic',
  standalone: true,
  imports: [RouterModule,NgbModule,FormsModule,ReactiveFormsModule ,ToastrModule,
    MatFormFieldModule, MatSelectModule, CommonModule, FlatpickrModule, ShowCodeContentDirective],
    // AngularFireModule,  AngularFireDatabaseModule, AngularFirestoreModule,
  providers: [FirebaseService,{ provide: ToastrService, useClass: ToastrService },FlatpickrDefaults, DatePipe],
  templateUrl: './basic.component.html',
  styleUrl: './basic.component.scss'
})
export class BasicComponent extends BaseComponent implements OnInit {
  crm = false; submitted =false; cnfmPaswrd: any = ''; paswrd:any = '';
  adonai = false;btnDisable =false; todayDt = new Date();
  adoanAiRole :any;
  crmRole :any;
  toolsList = [Tools.Adonai,Tools.Crm]

  signupFrm: FormGroup = this.fb.group({ 
    type : ['', Validators.required],
    companyName : ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.required],
    country: ['', Validators.required],
    dob: [new Date()],
    crm:false,
    adonai:false,
    phoneNumber: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', [Validators.required,this.passwordValidator]],
    tools : [[],Validators.required]
    //"toolId": 0,
    //"roleId": 0,
  })
  
  constructor(public fb: FormBuilder, public switchService: SwitherService, 
    private toastr: ToastrService, private router: Router, private dp: DatePipe){
    super();
    document.body.classList.add('authentication-background');
  }

  ngOnInit(){
  }
  ngOnDestroy(): void {
    document.body.classList.remove('authentication-background');    
  }
  get f() {
    return this.signupFrm.controls;
  }
  // ngAfterViewChecked() {
  //   console.log("60",this.signupFrm.get('tools'))
  // }
  passwordValidator(control: any) {
    const value = control.value;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasMinLength = value.length >= 8;
    const valid = hasUpperCase && hasLowerCase && hasNumber && hasMinLength;
    return valid ? null : { invalidPassword: true };
  }

  onSignup(){
    this.submitted = true; 
    const crm = this.signupFrm.get('tools')?.value.includes('crm');
    const adonai = this.signupFrm.get('tools')?.value.includes('adonai');
    let payload = this.signupFrm.getRawValue();
    payload.type = +payload.type,
    payload.crm = crm,
    payload.adonai = adonai,
    payload.phoneNumber = +payload.phoneNumber, delete payload.tools,
    payload.dob = this.dp.transform(payload.dob, 'dd-MM-yyyy')
    if (this.signupFrm.invalid) {
      this.toastr.error('Please fill mandatory fields','signup', {
        timeOut: 3000,
        positionClass: 'toast-top-right',
      });
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
    else{
      this.btnDisable = true;
      this.switchService.signupApi(payload).subscribe({ next: (res:any) => {
        if(res.status == true){
          this.toastr.success(res.message,'signup', {
            timeOut: 3000, positionClass: 'toast-top-right' });
          this.router.navigate(['auth/login'])
          } else {
            this.btnDisable = false;
            this.toastr.error(res.message,'signup', {
              timeOut: 3000, positionClass: 'toast-top-right' });
          }
        }
      })
    }
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
}
