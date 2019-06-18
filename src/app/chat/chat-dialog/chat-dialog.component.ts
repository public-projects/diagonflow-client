import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatService } from 'src/app/chat.service';
import { scan } from 'rxjs/operators';
import { Message } from '../message/message';
@Component({
  selector: 'app-chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.scss']
})
export class ChatDialogComponent implements OnInit {
  // used to apply scroll bottom (chat scroll)
  @ViewChild('chatbotContainer', { static: false }) chatbotContainerRef: ElementRef;
  messages: Observable<Message[]>;
  formValue: string;

  constructor(public chat: ChatService) { }

  ngOnInit() {
    // chatSrvice Message array update RT
    this.messages = this.chat.conversation.asObservable().pipe(
      scan((acc, val) => acc.concat(val))
    );
  }


  ngAfterViewChecked() {
    // apply chat style scroll bottom
    this.chatbotContainerRef.nativeElement.scrollTop = this.chatbotContainerRef.nativeElement.scrollHeight;
  }
  // send the message to chat service to apply buisness logic and update DB
  sendMessage() {
    this.chat.converse(this.formValue);
    this.formValue = '';
  }
}

