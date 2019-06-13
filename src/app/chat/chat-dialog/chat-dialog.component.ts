import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Message, ChatService } from 'src/app/chat.service';
import { scan } from 'rxjs/operators';
@Component({
  selector: 'app-chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.scss']
})
export class ChatDialogComponent implements OnInit {


  messages: Observable<Message[]>;
  formValue: string;

  constructor(public chat: ChatService) { }

  ngOnInit() {
    // appends to array after each new message is added to feedSource
    this.messages = this.chat.conversation.asObservable().pipe(
      scan((acc, val) => acc.concat(val) )
    );
  }

  sendMessage() {
    this.chat.converse(this.formValue);
    this.formValue = '';
  }

}
