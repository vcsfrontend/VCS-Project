import {
  Component,
  Renderer2,
  HostListener,
  ElementRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { Menu, NavService } from '../../services/navservice';
import { Subscription, fromEvent } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { checkHoriMenu } from './sidebar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwitherService } from '../../../shared/services/swither.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements AfterViewInit {
  //////
  userDataStorage = localStorage.getItem('userDetails');
  userData: any = this.userDataStorage ? JSON.parse(this.userDataStorage) : null;
  userEmail: string = this.userData ? this.userData.email : '';
  eventTriggered: boolean = false;
  screenWidth!: number;
  public windowSubscribe$!: Subscription;
  options = { autoHide: false, scrollbarMinSize: 100 };
  public menuItems!: Menu[];
  public menuitemsSubscribe$!: Subscription;
  constructor(
    private navServices: NavService,
    public router: Router,
    public renderer: Renderer2,
    private elementRef: ElementRef,
    private cd: ChangeDetectorRef,
    public switchService: SwitherService, private toastr: ToastrService,) {
    let html = this.elementRef.nativeElement.ownerDocument.documentElement;
    

  }

  clearNavDropdown() {
    this.menuItems?.forEach((a: any) => {
      a.active = false;
      a?.children?.forEach((b: any) => {
        b.active = false;
        b?.children?.forEach((c: any) => {
          c.active = false;
        });
      });
    });
  }
  ngOnInit() {
    this.menuitemsSubscribe$ = this.navServices.items.subscribe((items) => {
      items.forEach((item) => {
        switch (item.title) {
          case 'Adonai':
            this.navServices.isAdonaiApplicable$.subscribe(val => {
              item.isVisible = val
            });
            break;
          // case 'CRM':
          //   // this.navServices.isCRMApplicable$.subscribe(val => {
          //   //   item.isVisible = val
          //   // });
          //   item.isVisible=true;
          //   break;
          case 'Dashboard':
            item.isVisible = true;
            break;
          case 'Projects':
            item.isVisible = true;
            break;
          case 'To-Do-List':
            item.isVisible = true;
            break;
          case 'HRM':
            item.isVisible = true;
            break;
          case 'Analytics':
            item.isVisible = true;
            break;
          case 'Customer':
            item.isVisible = true;
            break;
          // case 'Crm':
          //   item.isVisible = true;
          //   break;
          case 'Adonai Users':
            this.getSalesUsers(this.userEmail, item);
            break;
          // case 'bom':
          //   item.isVisible = true;
          //   break;
          // case 'enterprise':
          //   item.isVisible = true;
          //   break;
          // case 'leads':
          //   item.isVisible = true;
          //   break;
          // case 'Deals':
          //   item.isVisible = true;
          //   break;
          // case 'users':
          //   item.isVisible = true;
          //   break;
          // case 'Reports':
          //   item.isVisible = true;
          //   break;
          // case 'support':
          //   item.isVisible = true;
          //   break;
          // case 'optimizer':
          //   item.isVisible = true;
          //   break;
          // case 'Optimization':
          //   item.isVisible=true;
          //   break;
          // case 'proposal':
          //   item.isVisible = true;
          //   break;
          // case 'clients':
          //   item.isVisible = true;
          //   break;
          // case 'Appointment':
          //   item.isVisible = true;
          //   break;
          case 'Settings':
            this.checkAdminRole(item);
            break;
          case 'Tasks':
            item.isVisible = true;
            break;
        }
      })
      this.menuItems = items;
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setNavActive(null, this.router.url);
      }
    });


    const WindowResize = fromEvent(window, 'resize');
    // subscribing the Observable
    if (WindowResize) {
      this.windowSubscribe$ = WindowResize.subscribe(() => {
        // to check and adjst the menu on screen size change
        checkHoriMenu();
      });
    }

    if (document.querySelector('html')?.getAttribute('data-nav-layout') == 'horizontal' && window.innerWidth >= 992) { this.clearNavDropdown(); }

  }

  getSalesUsers(email: string = this.userEmail, item: any) {
    this.switchService.SalesUsers(email).subscribe({
      next: (res: any) => {
        const user = res;
        const subrole = Array.isArray(user) ? user[0]?.subRole : user?.subRole;
        const normalizedRole = subrole?.toLowerCase();
        item.isVisible = subrole === 'Manager' || subrole === 'Sales Person' || subrole === 'Account Manager';
      },
      error: (error) => {
        this.toastr.error("Error fetching user role");
        item.isVisible = false;
      }
    });
  }
  
  
  

  checkAdminRole(item: any) {
    let adonaiRole;
    let crmRole;

    this.navServices.adonaiRole$.subscribe(val => {
      adonaiRole = val;
    });

    this.navServices.crmRole$.subscribe(val => {
      crmRole = val;
    });

    if (adonaiRole === 'ADMIN' || crmRole === 'ADMIN') {
      item.isVisible = true;
    }
  }

  // Start of Set menu Active event
  setNavActive(event: any, currentPath: string, menuData = this.menuItems) {
    // console.log("103",currentPath)
    if (event) {
      if (event?.ctrlKey) {
        return;
      }
    }
    let html = document.documentElement;
    if (html.getAttribute('data-nav-style') != "icon-hover" && html.getAttribute('data-nav-style') != "menu-hover") {
      // if (!event?.ctrlKey) {
      for (const item of menuData) {
        if (item.path === currentPath) {
          item.active = true;
          item.selected = true;
          this.setMenuAncestorsActive(item);
        } else if (!item.active && !item.selected) {
          item.active = false; // Set active to false for items not matching the target
          item.selected = false; // Set active to false for items not matching the target
        } else {
          this.removeActiveOtherMenus(item);
        }
        if (item.children && item.children.length > 0) {
          this.setNavActive(event, currentPath, item.children);
        }
      }
      // }
    }
  }
  getParentObject(obj: any, childObject: Menu) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object' && JSON.stringify(obj[key]) === JSON.stringify(childObject)) {
          return obj; // Return the parent object
        }
        if (typeof obj[key] === 'object') {
          const parentObject: any = this.getParentObject(obj[key], childObject);
          if (parentObject !== null) {
            return parentObject;
          }
        }
      }
    }
    return null; // Object not found
  }

  hasParent = false;
  hasParentLevel = 0;
  setMenuAncestorsActive(targetObject: Menu) {
    const parent = this.getParentObject(this.menuItems, targetObject);
    let html = document.documentElement;
    if (parent) {
      if (this.hasParentLevel > 2) {
        this.hasParent = true;
      }
      parent.active = true;
      parent.selected = true;
      this.hasParentLevel += 1;
      this.setMenuAncestorsActive(parent);
    }
    else if (!this.hasParent) {

    }
  }
  removeActiveOtherMenus(item: any) {
    if (item) {
      if (Array.isArray(item)) {
        for (const val of item) {
          val.active = false;
          val.selected = false;
        }
      }
      item.active = false;
      item.selected = false;

      if (item.children && item.children.length > 0) {
        this.removeActiveOtherMenus(item.children);
      }
    }
    else {
      return;
    }
  }

  // Start of Toggle menu event
  toggleNavActive(event: any, targetObject: Menu, menuData = this.menuItems) {
    let html = document.documentElement;
    let element = event.target;
    if (html?.getAttribute('data-vertical-style') == 'icontext') {
      html?.setAttribute('data-icon-text', 'open');
    } else {
      html?.removeAttribute('data-icon-text');
    }
    if (html.getAttribute('data-nav-style') != "icon-hover" && html.getAttribute('data-nav-style') != "menu-hover") {
      for (const item of menuData) {
        if (item === targetObject) {
          if (html.getAttribute('data-vertical-style') == 'doublemenu' && item.active) { return }
          item.active = !item.active;
          if (item.active) {
            this.closeOtherMenus(menuData, item);
          } else {
            if (html.getAttribute('data-vertical-style') == 'doublemenu') {
              html.setAttribute('data-toggled', 'double-menu-close');
            }
          }
          this.setAncestorsActive(menuData, item);

        } else if (!item.active) {
          if (html.getAttribute('data-vertical-style') != 'doublemenu') {
            item.active = false; // Set active to false for items not matching the target
          }
        }
        if (item.children && item.children.length > 0) {
          this.toggleNavActive(event, targetObject, item.children);
        }
      }
      if (targetObject?.children && targetObject.active) {
        if (html.getAttribute('data-vertical-style') == 'doublemenu' && html.getAttribute('data-toggled') != 'double-menu-open') {
          html.setAttribute('data-toggled', 'double-menu-open');
        }
      }
      if (element && html.getAttribute("data-nav-layout") == 'horizontal' && (html.getAttribute("data-nav-style") == 'menu-click' || html.getAttribute("data-nav-style") == 'icon-click')) {
        const listItem = element.closest("li");
        if (listItem) {
          // Find the first sibling <ul> element
          const siblingUL = listItem.querySelector("ul");
          let outterUlWidth = 0;
          let listItemUL = listItem.closest('ul:not(.main-menu)');
          while (listItemUL) {
            listItemUL = listItemUL.parentElement.closest('ul:not(.main-menu)');
            if (listItemUL) {
              outterUlWidth += listItemUL.clientWidth;
            }
          }
          if (siblingUL) {
            // You've found the sibling <ul> element
            let siblingULRect = listItem.getBoundingClientRect();
            if (html.getAttribute('dir') == 'rtl') {
              if ((siblingULRect.left - siblingULRect.width - outterUlWidth + 150 < 0 && outterUlWidth < window.innerWidth) && (outterUlWidth + siblingULRect.width + siblingULRect.width < window.innerWidth)) {
                targetObject.dirchange = true;
              } else {
                targetObject.dirchange = false;
              }
            } else {
              if ((outterUlWidth + siblingULRect.right + siblingULRect.width + 50 > window.innerWidth && siblingULRect.right >= 0) && (outterUlWidth + siblingULRect.width + siblingULRect.width < window.innerWidth)) {
                targetObject.dirchange = true;
              } else {
                targetObject.dirchange = false;
              }
            }
          }
          setTimeout(() => {
            let computedValue = siblingUL.getBoundingClientRect();
            if ((computedValue.bottom) > window.innerHeight) {
              siblingUL.style.height = (window.innerHeight - computedValue.top - 8) + 'px !important';
              siblingUL.style.overflow = 'auto !important';
            }
          }, 100);
        }
      }
    }
  }
  setAncestorsActive(menuData: Menu[], targetObject: Menu) {
    let html = document.documentElement;
    const parent = this.findParent(menuData, targetObject);
    if (parent) {
      parent.active = true;
      if (parent.active) {
        html.setAttribute('data-toggled', 'double-menu-open');
      }
      this.setAncestorsActive(menuData, parent);
    } else {
      if (html.getAttribute('data-vertical-style') == 'doublemenu') {
        html.setAttribute('data-toggled', 'double-menu-close');
      }
    }
  }
  closeOtherMenus(menuData: Menu[], targetObject: Menu) {
    for (const item of menuData) {
      if (item !== targetObject) {
        item.active = false;
        if (item.children && item.children.length > 0) {
          this.closeOtherMenus(item.children, targetObject);
        }
      }
    }
  }
  findParent(menuData: Menu[], targetObject: Menu) {
    for (const item of menuData) {
      if (item.children && item.children.includes(targetObject)) {
        return item;
      }
      if (item.children && item.children.length > 0) {
        const parent: any = this.findParent(item.children, targetObject);
        if (parent) {
          return parent;
        }
      }
    }
    return null;
  }
  // End of Toggle menu event
  HoverToggleInnerMenuFn(event: Event, item: Menu) {
    let html = document.documentElement;
    let element = event.target as HTMLElement;
    if (element && html.getAttribute("data-nav-layout") == 'horizontal' && (html.getAttribute("data-nav-style") == 'menu-hover' || html.getAttribute("data-nav-style") == 'icon-hover')) {
      const listItem = element.closest("li");
      if (listItem) {
        // Find the first sibling <ul> element
        const siblingUL = listItem.querySelector("ul");
        let outterUlWidth = 0;
        let listItemUL: any = listItem.closest('ul:not(.main-menu)');
        while (listItemUL) {
          listItemUL = listItemUL.parentElement?.closest('ul:not(.main-menu)');
          if (listItemUL) {
            outterUlWidth += listItemUL.clientWidth;
          }
        }
        if (siblingUL) {
          // You've found the sibling <ul> element
          let siblingULRect = listItem.getBoundingClientRect();
          if (html.getAttribute('dir') == 'rtl') {
            if ((siblingULRect.left - siblingULRect.width - outterUlWidth + 150 < 0 && outterUlWidth < window.innerWidth) && (outterUlWidth + siblingULRect.width + siblingULRect.width < window.innerWidth)) {
              item.dirchange = true;
            } else {
              item.dirchange = false;
            }
          } else {
            if ((outterUlWidth + siblingULRect.right + siblingULRect.width + 50 > window.innerWidth && siblingULRect.right >= 0) && (outterUlWidth + siblingULRect.width + siblingULRect.width < window.innerWidth)) {
              item.dirchange = true;
            } else {
              item.dirchange = false;
            }
          }
        }
      }
    }
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.setNavActive(null, this.router.url);
    checkHoriMenu();
    this.cd.detectChanges();
  }
  ngOnDestroy() {
    this.menuitemsSubscribe$.unsubscribe();
    this.windowSubscribe$.unsubscribe();
    document.querySelector('html')?.setAttribute('data-vertical-style', 'overlay');
    document.querySelector('html')?.setAttribute('data-nav-layout', 'vertical');
  }


  leftArrowFn() {
    // Used to move the slide of the menu in Horizontal and also remove the arrows after click  if there was no space 
    // Used to Slide the menu to Left side
    let slideLeft = document.querySelector('.slide-left') as HTMLElement;
    let slideRight = document.querySelector('.slide-right') as HTMLElement;
    let menuNav = document.querySelector('.main-menu') as HTMLElement;
    let mainContainer1 = document.querySelector('.main-sidebar') as HTMLElement;
    let marginRightValue = Math.ceil(Number(window.getComputedStyle(menuNav).marginInlineStart.split('px')[0]));
    let mainContainer1Width = mainContainer1.offsetWidth;
    if (menuNav.scrollWidth > mainContainer1.offsetWidth) {
      if (marginRightValue < 0 && !(Math.abs(marginRightValue) < mainContainer1Width)) {
        menuNav.style.marginInlineStart = Number(menuNav.style.marginInlineStart.split('px')[0]) + Math.abs(mainContainer1Width) + 'px';
        slideRight.classList.remove('d-none');
      } else if (marginRightValue >= 0) {
        menuNav.style.marginInlineStart = '0px';
        slideLeft.classList.add('d-none');
        slideRight.classList.remove('d-none');
      } else {
        menuNav.style.marginInlineStart = '0px';
        slideLeft.classList.add('d-none');
        slideRight.classList.remove('d-none');
      }
    }
    else {
      menuNav.style.marginInlineStart = "0px";
      slideLeft.classList.add('d-none');
    }

    let element = document.querySelector(".main-menu > .slide.open") as HTMLElement;
    let element1 = document.querySelector(".main-menu > .slide.open >ul") as HTMLElement;
    if (element) {
      element.classList.remove("open")
    }
    if (element1) {
      element1.style.display = "none"
    }
  }
  rightArrowFn() {
    // Used to move the slide of the menu in Horizontal and also remove the arrows after click  if there was no space 
    // Used to Slide the menu to Right side
    let slideLeft = document.querySelector('.slide-left') as HTMLElement;
    let slideRight = document.querySelector('.slide-right') as HTMLElement;
    let menuNav = document.querySelector('.main-menu') as HTMLElement;
    let mainContainer1 = document.querySelector('.main-sidebar') as HTMLElement;
    let marginRightValue = Math.ceil(Number(window.getComputedStyle(menuNav).marginInlineStart.split('px')[0]));
    let check = menuNav.scrollWidth - mainContainer1.offsetWidth;
    let mainContainer1Width = mainContainer1.offsetWidth;
    if (menuNav.scrollWidth > mainContainer1.offsetWidth) {
      if (Math.abs(check) > Math.abs(marginRightValue)) {
        if (!(Math.abs(check) > Math.abs(marginRightValue) + mainContainer1Width)) {
          mainContainer1Width = Math.abs(check) - Math.abs(marginRightValue);
          slideRight.classList.add('d-none');
        }
        menuNav.style.marginInlineStart = Number(menuNav.style.marginInlineStart.split('px')[0]) - Math.abs(mainContainer1Width) + 'px';
        slideLeft.classList.remove('d-none');
      }
    }

    let element = document.querySelector(".main-menu > .slide.open") as HTMLElement
    let element1 = document.querySelector(".main-menu > .slide.open >ul") as HTMLElement
    if (element) {
      element.classList.remove("open")
    }
    if (element1) {
      element1.style.display = "none"
    }
  }

  // Addding sticky-pin
  scrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 10;

    const sections = document.querySelectorAll('.side-menu__item');
    const scrollPos =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop;

    sections.forEach((ele, i) => {
      const currLink = sections[i];
      const val: any = currLink.getAttribute('value');
      const refElement: any = document.querySelector('#' + val);

      // Add a null check here before accessing properties of refElement
      if (refElement !== null) {
        const scrollTopMinus = scrollPos + 73;
        if (
          refElement.offsetTop <= scrollTopMinus &&
          refElement.offsetTop + refElement.offsetHeight > scrollTopMinus
        ) {
          document.querySelector('.nav-scroll')?.classList.remove('active');
          currLink.classList.add('active');
        } else {
          currLink.classList.remove('active');
        }
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.menuResizeFn();

    this.screenWidth = window.innerWidth;

    // Check if the event hasn't been triggered and the screen width is less than or equal to your breakpoint
    if (!this.eventTriggered && this.screenWidth <= 992) {
      document.documentElement?.setAttribute('data-toggled', 'close')


      // Trigger your event or perform any action here
      this.eventTriggered = true; // Set the flag to true to prevent further triggering
    } else if (this.screenWidth > 992) {
      // Reset the flag when the screen width goes beyond the breakpoint
      this.eventTriggered = false;
    }
  }
  WindowPreSize: number[] = [window.innerWidth];
  menuResizeFn(): void {
    this.WindowPreSize.push(window.innerWidth);

    if (this.WindowPreSize.length > 2) {
      this.WindowPreSize.shift();
    }

    if (this.WindowPreSize.length > 1) {
      const html = document.documentElement;

      if (this.WindowPreSize[this.WindowPreSize.length - 1] < 992 && this.WindowPreSize[this.WindowPreSize.length - 2] >= 992) {
        // less than 992
        html.setAttribute('data-toggled', 'close');
      }

      if (this.WindowPreSize[this.WindowPreSize.length - 1] >= 992 && this.WindowPreSize[this.WindowPreSize.length - 2] < 992) {
        // greater than 992
        html.removeAttribute('data-toggled');
        document.querySelector('#responsive-overlay')?.classList.remove('active');
      }
    }
  }

  fileName: string | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileName = input.files[0].name;
    } else {
      this.fileName = null; // Reset if no file selected
    }
  }

  myFileClick() {
    const fileManagerFolders = document.querySelector('.file-manager-folders');
    const fileManagerNavigation = document.querySelector('.file-manager-navigation');

    if (window.innerWidth <= 992) {
      if (fileManagerFolders) {
        fileManagerFolders.classList.add('open');
      }
      if (fileManagerNavigation) {
        fileManagerNavigation.classList.add('close');
      }
    } else {
      if (fileManagerFolders) {
        fileManagerFolders.classList.remove('open');
      }
      if (fileManagerNavigation) {
        fileManagerNavigation.classList.remove('close');
      }
    }
  }

}
