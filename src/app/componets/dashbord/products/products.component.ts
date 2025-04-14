import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NouisliderModule } from 'ng2-nouislider';
import { NgbCollapseModule, NgbDropdownModule  } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/common/sharedmodule';
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [SharedModule, RouterModule, NouisliderModule, NgbCollapseModule, FormsModule, NgbDropdownModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  
}
