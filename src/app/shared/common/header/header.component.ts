import { Component, ElementRef, OnInit, Renderer2, inject,} from '@angular/core';
import { Menu, NavService } from '../../services/navservice';
import { SwitcherComponent } from '../switcher/switcher.component';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { AppStateService } from '../../services/app-state.service';
import { ActivatedRoute, NavigationEnd, Router, RouterModule ,UrlTree } from '@angular/router';
import { filter ,interval,Subscription} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { SharedModule } from '../sharedmodule';
import { SwitherService } from '../../services/swither.service';
interface Item {
  id: number;
  name: string;
  type: string;
  title: string;
  // Add other properties as needed
}
@Component({
  selector: 'app-header',
  // standalone: true,
  // imports: [RouterModule, FormsModule, ReactiveFormsModule, CommonModule, ToastrModule, SharedModule],
  // providers: [{ provide: ToastrService, useClass: ToastrService }],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  cartItemCount: number = 5;
  notificationCount: number = 5;
  public isCollapsed = true;
   public leadCount = 0;
  collapse: any; userList: any; loggedInUser: any;
  closeResult = ''; campaignId!: string; followUpCount: any; nextLeadStatus :any;
  themeType: string | undefined; userName:any; userData:any;  userEmail :any
  userColors = ['bg-primary', 'bg-success', 'bg-warning', 'bg-danger', 'bg-info', 'bg-secondary',
    'bg-pink', 'bg-teal', 'bg-indigo', 'bg-orange', 'bg-dark', 'bg-light'];
  profilePic: string | null = null;
  selectedItem: string  | null ='selectedItem'
  isOpen: boolean = false; isCrm:boolean = false; isAdonai:boolean = false;
  constructor(
    private appStateService: AppStateService,
    public navServices: NavService,
    private elementRef: ElementRef,
    public renderer: Renderer2,
    public modalService:NgbModal,
    private toastr: ToastrService, private switchService: SwitherService,
    private router: Router, private activatedRoute: ActivatedRoute, private http: HttpClient
  ) {this.localStorageBackUp()
    this.userData = localStorage.getItem('userDetails'),
    this.userName = JSON.parse(this.userData)?.username,
    this.userEmail = JSON.parse(this.userData)?.email,
    this.isCrm = JSON.parse(this.userData)?.crm,
    this.isAdonai = JSON.parse(this.userData)?.adonai
  }

  private offcanvasService = inject(NgbOffcanvas);

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  handleItemClick(title: string) {
    this.selectedItem = title;
    this.isOpen = false;
    localStorage.setItem('selectedItem', title);
  }
  open() {
    this.offcanvasService.open(SwitcherComponent, {
      position: 'end',
      scroll: true,
    });
  }
  openModal(content:any) {
    this.modalService.open(content);
  }
  openSearch(search: any) {
    // this.modalService.open(search);
  }
  toggleSidebar() {
    let html = this.elementRef.nativeElement.ownerDocument.documentElement;
    if (html?.getAttribute('data-toggled') == 'true') {
      document.querySelector('html')?.getAttribute('data-toggled') ==
        'icon-overlay-close';
    }
    else if (html?.getAttribute('data-nav-style') == 'menu-click') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'menu-click-closed'
          ? ''
          : 'menu-click-closed'
      );
    } else if (html?.getAttribute('data-nav-style') == 'menu-hover') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'menu-hover-closed'
          ? ''
          : 'menu-hover-closed'
      );
    } else if (html?.getAttribute('data-nav-style') == 'icon-click') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'icon-click-closed'
          ? ''
          : 'icon-click-closed'
      );
    } else if (html?.getAttribute('data-nav-style') == 'icon-hover') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'icon-hover-closed'
          ? ''
          : 'icon-hover-closed'
      );
    }
    else if (html?.getAttribute('data-vertical-style') == 'overlay') {
      html?.setAttribute(
        'data-vertical-style','overlay' 
      );
      html?.setAttribute(
        'data-toggled', html?.getAttribute('data-toggled') == 'icon-overlay-close'
        ? ''
        : 'icon-overlay-close'
      );
    } else if (html?.getAttribute('data-vertical-style')  == 'overlay') {
      document.querySelector('html')?.getAttribute('data-toggled') != null
        ? document.querySelector('html')?.removeAttribute('data-toggled')
        : document
            .querySelector('html')
            ?.setAttribute('data-toggled', 'icon-overlay-close');
    } else if (html?.getAttribute('data-vertical-style') == 'closed') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'close-menu-close'
          ? ''
          : 'close-menu-close'
      );
    } else if (html?.getAttribute('data-vertical-style') == 'icontext') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'icon-text-close'
          ? ''
          : 'icon-text-close'
      );
    } else if (html?.getAttribute('data-vertical-style') == 'detached') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'detached-close'
          ? ''
          : 'detached-close'
      );
    }else if (html?.getAttribute('data-vertical-style') == 'doublemenu') {
      html?.setAttribute('data-toggled', html?.getAttribute('data-toggled') == 'double-menu-close' && document.querySelector(".slide.open")?.classList.contains("has-sub")? 'double-menu-open': 'double-menu-close' );
    } 

    if (window.innerWidth <= 992) {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'open' ? 'close' : 'open'
      );
    }
  }
  updateTheme(theme: string) {
    this.appStateService.updateState({ theme , menuColor:theme });
    if(theme=='light'){
      this.appStateService.updateState({ theme,themeBackground : '',headerColor:'light',menuColor:'light' });
      let html = document.querySelector('html');
        html?.style.removeProperty( '--body-bg-rgb');
        html?.style.removeProperty( '--body-bg-rgb2');
        html?.style.removeProperty( '--light-rgb');
        html?.style.removeProperty( '--form-control-bg');
        html?.style.removeProperty( '--input-border' );
        // html?.style.removeProperty('--primary');
        html?.style.removeProperty('--primary-rgb');
      }
    if(theme=='dark'){
      this.appStateService.updateState({ theme,themeBackground : '',headerColor:'dark',menuColor:'dark' });
      let html = document.querySelector('html');
        html?.style.removeProperty( '--body-bg-rgb');
        html?.style.removeProperty( '--body-bg-rgb2');
        html?.style.removeProperty( '--light-rgb');
        html?.style.removeProperty( '--form-control-bg');
        html?.style.removeProperty( '--input-border' );
        // html?.style.removeProperty('--primary');
        html?.style.removeProperty('--primary-rgb');
      
    }
  }
 

  localStorageBackUp() {
    let styleId = document.querySelector('#style');
  
    let html = document.querySelector('html');
    //Theme Color Mode:
    if (localStorage.getItem('valexHeader') == 'dark') {
      if (localStorage.getItem('valexdarktheme')) {
        const type: any = localStorage.getItem('valexdarktheme');
        html?.setAttribute('data-theme-mode', type);
        html?.setAttribute('data-header-styles', type);
        html?.setAttribute('data-menu-styles', type);
      }
      if (localStorage.getItem('valexdarktheme') == 'light') {
        const type: any = localStorage.getItem('valexdarktheme');
        html?.setAttribute('data-theme-mode', type);
        html?.setAttribute('data-header-styles', type);
        html?.setAttribute('data-menu-styles', type);
      }
    }
  }
  isCartEmpty: boolean = false;
  isNotifyEmpty: boolean = false;

  removeRow(rowId: string) {
    const rowElement = document.getElementById(rowId);
    if (rowElement) {
      rowElement.remove();
    }
    this.cartItemCount--;
    this.isCartEmpty = this.cartItemCount === 0;
  }
  removeNotify(rowId: string) {
    const rowElement = document.getElementById(rowId);
    if (rowElement) {
      rowElement.remove();
    }
    this.notificationCount--;
    this.isNotifyEmpty = this.notificationCount === 0;
  }
  handleCardClick(event: MouseEvent) {
    // Prevent the click event from propagating to the container
    event.stopPropagation();
  }

  // Search
  public menuItems!: Menu[];
  public items!: Menu[];
  public text!: string;
    private routerSub!: Subscription;
  private intervalSub!: Subscription;
  public SearchResultEmpty: boolean = false;
  ngOnInit(): void {
    // this.getUserInfo(this.userEmail);
    this.logRoute();
    this.loadLeadData();
    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.loadLeadData();
      }
    });
    // this.profilePic = localStorage.getItem("profilePic");
    this.loggedInUser = JSON.parse(this.userData);
    this.userName = this.loggedInUser?.name || this.loggedInUser?.username;
    this.intervalSub = interval(5000).subscribe(() => this.loadLeadData());
    this.loadLeadData();
    const storedSelectedItem = localStorage.getItem('selectedItem');
    if (!storedSelectedItem) {
      this.selectedItem = "Sales Dashboard"; // You can set any default item here
      localStorage.setItem('selectedItem', this.selectedItem);
    } else {
      this.selectedItem = storedSelectedItem;
    }
    this.navServices.items.subscribe((menuItems) => {
      this.items = menuItems;
    });
    document.querySelector('.main-content')?.addEventListener('click', () => {
      this.clearSearch();
    });
    this.text = '';
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.updateSelectedItem();
    });

  }
  
  private updateSelectedItem() {
    const dashboard = this.activatedRoute.snapshot.firstChild?.url[0]?.path;
    this.selectedItem = dashboard ? dashboard.charAt(0).toUpperCase() + dashboard.slice(1) + ' Dashboard' : this.selectedItem;
  }
  ngOnDestroy(): void {
    this.routerSub.unsubscribe();
    this.intervalSub.unsubscribe();
    const windowObject: any = window;
    let html = this.elementRef.nativeElement.ownerDocument.documentElement;
    if (windowObject.innerWidth <= '991') {
      html?.setAttribute('data-toggled', 'open');
    }
    window.addEventListener('resize', () => {
      if (localStorage.getItem('valexverticalstyles') != 'icon-text-close') {
        if (windowObject.innerWidth <= '991') {
          html?.setAttribute('data-toggled', 'open');
        } else {
          if (!(localStorage.getItem('valexverticalstyles') == 'doublemenu')) {
            html?.removeAttribute('data-toggled');
          }
        }
      } else {
        document
          .querySelector('html')
          ?.setAttribute('data-toggled', 'icon-text-close');
      }
    });

    if (windowObject.innerWidth <= '991') {
      html?.setAttribute('data-toggled', 'open');
    }
  }
  Search(searchText: string) {
    if (!searchText) return this.menuItems = [];
    // items array which stores the elements
    const items:Item[] = [];
    // Converting the text to lower case by using toLowerCase() and trim() used to remove the spaces from starting and ending
    searchText = searchText.toLowerCase().trim();
    this.items.filter((menuItems:Menu) => {
      // checking whether menuItems having title property, if there was no title property it will return
      if (!menuItems?.title) return false;
      //  checking wheteher menuitems type is text or string and checking the titles of menuitems
      if (menuItems.type === 'link' && menuItems.title.toLowerCase().includes(searchText)) {
        // Converting the menuitems title to lowercase and checking whether title is starting with same text of searchText
        if( menuItems.title.toLowerCase().startsWith(searchText)){ // If you want to get all the data with matching to letter entered remove this line(condition and leave items.push(menuItems))
          // If both are matching then the code is pushed to items array
          items.push(menuItems as Item);
        }
      }
      //  checking whether the menuItems having children property or not if there was no children the return
      if (!menuItems.children) return false;
      menuItems.children.filter((subItems:Menu) => {
        if (!subItems?.title) return false; 
        if (subItems.type === 'link' && subItems.title.toLowerCase().includes(searchText)) {
          if( subItems.title.toLowerCase().startsWith(searchText)){         // If you want to get all the data with matching to letter entered remove this line(condition and leave items.push(subItems))
            items.push(subItems as Item);
          }

        }
        if (!subItems.children) return false;
        subItems.children.filter((subSubItems:Menu) => {
          if (subSubItems.title?.toLowerCase().includes(searchText)) {
            if( subSubItems.title.toLowerCase().startsWith(searchText)){ // If you want to get all the data with matching to letter entered remove this line(condition and leave items.push(subSubItems))
              items.push(subSubItems as Item);
              
            }
          }
        });
        return true;
      });
      return this.menuItems = items;
    });
    // Used to show the No search result found box if the length of the items is 0
    if(!items.length){
      this.SearchResultEmpty = true;
    }
    else{
      this.SearchResultEmpty = false;
    }
    return true;
  }
  SearchModal(SearchModal: any) {
    this.modalService.open(SearchModal);
  }
  //  Used to clear previous search result
  clearSearch() {    
    const headerSearch = document.querySelector('.header-search');
    if (headerSearch) {
        headerSearch.classList.remove('searchdrop');
    }
    this.text = '';
    this.menuItems = [];
    this.SearchResultEmpty = false;
    return this.text, this.menuItems;
    
  }
  SearchHeader() {
    document
    .querySelector('.header-search')
    ?.classList.toggle('searchdrop');
  }
  isInputFocused: boolean = false;

  onInputFocus() {
    this.isInputFocused = true;
  }

  onInputBlur() {
    this.isInputFocused = false;
  }

  // isFullscreen = false;

  // fullScreenToggle() {
  //   this.isFullscreen = !this.isFullscreen;
  // }
  isFullscreen: boolean = false;
  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
  }

  onLogout(){
    // window.location.href = 'https://crmexpert.vcs.plus/auth/logout';
    if(this.isAdonai){
      // this.http.post('https://adonai.vcs.plus/api/account/oauth/token/logout', {}, { withCredentials: true }).subscribe({ next: (res:any) => {
      this.switchService.logout().subscribe({ next: (res:any) => {
        location.reload();//adonai.vcs.plus/api/account/oauth/token/logout
        },
        error: (error) => {
          // this.toastr.error('Adonai Logout failed', error);
        },
      })
    }
    // this.router.navigate(['/auth/login']);
    localStorage.clear();
  }

  // onLogout(){
    
  //     this.http.post('https://adonai.vcs.plus/api/account/auth/token/logout', {}).subscribe({ next: (res:any) => {
  //       this.router.navigate(['/auth/login']);
  //       location.reload();
  //       },
  //       error: (error) => {
  //         this.toastr.error('Logout failed', error);
  //       },
  //     })
  //   this.router.navigate(['/auth/login']);
    
  // }

  loadLeadData() {
    const storedDataRaw = localStorage.getItem('leadData');
    const storedData = storedDataRaw ? JSON.parse(storedDataRaw) : {};
    this.campaignId = storedData.campaignId || null;
    this.followUpCount = storedData.followUpCount || 0;
    this.nextLeadStatus = storedData.nextLeadStatus || 'No follow-up';
  }

  logRoute() {
    const urlTree: UrlTree = this.router.createUrlTree(['/apps/crm/leads'], {
      queryParams: { campaignId: this.campaignId }
    });

    const fullUrl = this.router.serializeUrl(urlTree);
  }

  private hashString(str: string): number {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return hash >>> 0;
  }

  getUserColor(user: any): string {
    const index = this.hashString(user.email) % this.userColors.length;
    return this.userColors[index];
  }

  // getUserInfo(email: string) {
  //   this.switchService.userInfo(email).subscribe({
  //     next: (res: any) => {
  //       if (res) {
  //         this.userData = res;
  //         this.profilePic = res.profilePic
  //       }
  //     },
  //   });
  // }
  
}