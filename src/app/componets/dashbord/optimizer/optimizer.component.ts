import { Component } from '@angular/core';
import { NgbNavModule,NgbDropdownModule  } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../../../shared/common/sharedmodule';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-optimizer',
  standalone: true,
  imports: [SharedModule,NgbNavModule, NgbDropdownModule, NgSelectModule],
  templateUrl: './optimizer.component.html',
  styleUrl: './optimizer.component.scss'
})
export class OptimizerComponent {
  constructor(private modalService: NgbModal) {}


  Selection = [
    { value: 1, label: 'English' },
    { value: 2, label: 'French' },
    { value: 3, label: 'Arabic' },
    { value: 4, label: 'Hindi' },
  
];
VerticallyScrol(content: any) {
  this.modalService.open(content, { backdrop: 'static', keyboard: false, scrollable: true, centered: true, size: 'lg' });
}
}
