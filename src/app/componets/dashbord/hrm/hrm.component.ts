
import { Component,OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/common/sharedmodule';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-hrm',
  standalone: true,
  imports: [SharedModule,NgbDropdownModule],
  templateUrl: './hrm.component.html',
  styleUrl: './hrm.component.scss'
})
export class HrmComponent {
}
