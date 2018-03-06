import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app.routing';
import { NavbarModule } from './shared/navbar/navbar.module';
import { FooterModule } from './shared/footer/footer.module';
import { SidebarModule } from './sidebar/sidebar.module';
import { LbdModule } from './lbd/lbd.module';

import { AppComponent } from './app.component';

import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { TablesComponent } from './tables/tables.component';
import { TypographyComponent } from './typography/typography.component';
import { IconsComponent } from './icons/icons.component';
import { MapsComponent } from './maps/maps.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { UpgradeComponent } from './upgrade/upgrade.component';
import {UserService} from './services/user.service';
import {UinotificationService} from './services/uinotification.service';
import {CookieService} from 'ngx-cookie-service';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {ChatService} from "./services/chat.service";
import {ServerNotificationService} from "./services/servernotification.service";
import {WebsocketService} from "./services/websocket.service";
import {ChatComponent} from './chat/chat.component';
import {LoadingModule, ANIMATION_TYPES} from 'ngx-loading';
import {LectureService, QuestionService, MoodService, AnswerService, StudentService} from './api/api/api';
import {LectureComponent} from "./lecture/lecture.component";
import {ChatMessageComponent} from "./chat/chatmessage.component";
import {DatePipe} from "@angular/common";
import {TextpreviewPipe} from "./pipes/textpreview.pipe";
import {QuestionpreviewComponent} from "./lecture/questionpreview.component";



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserComponent,
    TablesComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    UpgradeComponent,
    ChatComponent,
    ChatMessageComponent,
    LectureComponent,
    QuestionpreviewComponent,


    // Pips
    TextpreviewPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    NavbarModule,
    FooterModule,
    SidebarModule,
    RouterModule,
    AppRoutingModule,
    LbdModule,
    ReactiveFormsModule,

    LoadingModule.forRoot({
      animationType: ANIMATION_TYPES.wanderingCubes,
      backdropBackgroundColour: 'rgba(0,0,0,0.1)',
      backdropBorderRadius: '4px',
      primaryColour: '#ffffff',
      secondaryColour: '#ffffff',
      tertiaryColour: '#ffffff'
  })
  ],
  providers: [
      UserService,
      UinotificationService,
      CookieService,
      StudentService,
      ChatService,
      ServerNotificationService,
      WebsocketService,
      LectureService,
      AnswerService,
      MoodService,
      QuestionService,
      HttpClientModule,
      DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
