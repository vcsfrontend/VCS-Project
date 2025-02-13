import { Component } from '@angular/core';
import { NgbDropdownModule,NgbTooltipModule  } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../shared/common/sharedmodule';
interface Contacts {
  image?: string;
  name?: string;
  email?:string;
  number?:string
  
}
@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [NgbDropdownModule,NgbTooltipModule , SharedModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {
  contacts: Contacts[] = [
    {
      name: 'Emily',
      image: './assets/images/faces/3.jpg',
      number:'+1(555) 354 2345',
      email:'emiley2134@gmail.com'
     
    },
    {
      name: '  William',
      image: './assets/images/faces/15.jpg',
      email:'William111@gmail.com',
      number:' +1(555) 873 8923',
    },
    {
      name: 'Charlotte',
      image: './assets/images/faces/2.jpg',
      email:'Charlotte@gmail.com',
      number:'  +1(555) 347 0923',
      
    },
    {
      name: 'Christopher',
      image: './assets/images/faces/13.jpg',
      email:'Christopher@gmail.com',
      number:' +1(555) 674 7824',
    },
    {
      name: 'Steven',
      image: './assets/images/faces/9.jpg',
      email:'Steven235@gmail.com',
      number:' +1(555) 985 2893',
    },
    {
      name: ' Isabella',
      image: './assets/images/faces/5.jpg',
      email:' Isabella456@gmail.com',
      number:'+1(555) 675 4680',
    },
    {
      name: '   Thomas',
      image: './assets/images/faces/10.jpg',
      email:'   Thomas00@gmail.com',
      number:'+1(555) 765 8937',
    },
    {
      name: '   Amelia',
      image: './assets/images/faces/21.jpg',
      email:'   Amelia@gmail.com',
      number:'+1(555) 890 5687',
    },
    {
      name: ' Richard',
      image: './assets/images/faces/11.jpg',
      email:'Richard@gmail.com',
      number:'+1(555) 972 9883',
    },
    {
      name: 'Anthony',
      image: './assets/images/media/media-63.jpg',
      email:'   Anthony65@gmail.com',
      number:'+1(555) 693 7836',
    },
    {
      name: 'Evelyn',
      image: '',
      email:'   Evelyn@gmail.com',
      number:' +1(555) 238 2342',
    },
    {
      name: ' Benjamin',
      image: './assets/images/faces/12.jpg',
      email:'Benjamin96@gmail.com',
      number:'+1(555) 875 6789',
    },
    {
      name: ' Victoria',
      image: './assets/images/faces/1.jpg',
      email:'Victoria@gmail.com',
      number:'  +1(555) 568 9234',
    },
    {
      name: ' Tom Holland',
      image: './assets/images/media/media-13.jpg',
      email:'tomholland98@gmail.com',
      number:'+1(555) 892 4334',
    },
    {
      name: ' Chloe',
      image: './assets/images/media/media-36.jpg',
      email:'Chloe@gmail.com',
      number:'+1(555) 882 3445',
    },
    {
      name: ' Sophia',
      image: './assets/images/faces/8.jpg',
      email:'Sophia@gmail.com',
      number:'+1(555) 973 8734',
    },
    {
      name: ' Audrey',
      image: './assets/images/faces/21.jpg',
      email:'Audrey@gmail.com',
      number:'+1(555) 234 9345',
    },
    {
      name: ' Michael',
      image: './assets/images/faces/14.jpg',
      email:'Michael89@gmail.com',
      number:'+1(555) 783 0213',
    },
    {
      name: ' Anthony',
      image: './assets/images/media/media-8.jpg',
      email:'Anthony@gmail.com',
      number:'+1(555) 234 2452',
    },
    {
      name: ' Harper',
      image: './assets/images/faces/7.jpg',
      email:'Harper@gmail.com',
      number:'+1(555) 890 2455',
    },
    {
      name: ' Andrew',
      image: './assets/images/media/media-34.jpg',
      email:'Andrew@gmail.com',
      number:'+1(555) 982 7648',
    },
    {
      name: ' Eric',
      image: './assets/images/media/media-21.jpg',
      email:'Eric@gmail.com',
      number:'+1(555) 002 1239',
    },
    {
      name: ' Grace',
      image: './assets/images/faces/6.jpg',
      email:'Grace@gmail.com',
      number:'+1(555) 982 4834',
    },
    {
      name: ' Samantha',
      image: '',
      email:'Samantha@gmail.com',
      number:'+1(555) 982 4834',
    },
  ];
}
