import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatDialogComponent } from './chat-dialog/chat-dialog.component';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../chat.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [ChatDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  exports: [ ChatDialogComponent ],
  providers: [ChatService]
})
export class ChatModule { }
