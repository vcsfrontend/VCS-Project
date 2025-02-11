import { Component } from '@angular/core';
import { NgbNavModule,NgbDropdownModule  } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';


@Component({
  selector: 'app-optimizer',
  standalone: true,
  imports: [NgbNavModule, NgbDropdownModule, NgSelectModule],
  templateUrl: './optimizer.component.html',
  styleUrl: './optimizer.component.scss'
})
export class OptimizerComponent {

  Selection = [
    { value: 1, label: 'English' },
    { value: 2, label: 'French' },
    { value: 3, label: 'Arabic' },
    { value: 4, label: 'Hindi' },
  
];

}
