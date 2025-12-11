import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { NgxEchartsModule } from 'ngx-echarts';
import { ColorPickerModule } from 'ngx-color-picker';
// import filepond module
import { FilePondModule } from 'ngx-filepond';
import { AppStateService } from './shared/services/app-state.service';
import { ChatbotComponent } from './componets/dashbord/chatbot/chatbot.component';
import { SwitherService } from './shared/services/swither.service';
@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [FilePondModule, RouterOutlet, ToastrModule, NgxEchartsModule, ColorPickerModule,ChatbotComponent],
    template: `<app-chatbot></app-chatbot>`

})
export class AppComponent {
  title = 'VCS';  userEmail: any;

  constructor(private appState : AppStateService,private switchService: SwitherService,){
    this.appState.updateState();
  }

  ngOnInit(): void {
    this.userEmail = localStorage.getItem('email');
    if (!this.switchService.userInfoCache && this.userEmail) {
      this.switchService.userInfo(this.userEmail).subscribe();
    }
  }



}
