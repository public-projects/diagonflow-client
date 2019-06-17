import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { ApiAiClient } from 'api-ai-javascript/es6/ApiAiClient';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Message } from './chat/message/message';
import { Question } from './chat/interfaces/question';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  readonly token = environment.dialogflow.angularBot;
  readonly client = new ApiAiClient({ accessToken: this.token });

  conversation = new BehaviorSubject<Message[]>([]);

  constructor(private httpClient: HttpClient) { }

  converse(msg: string): void {
    const userMessage = new Message(msg, 'user');
    this.updateMessage(userMessage);
    const questionRequestBody: Question = {
      question: userMessage.content
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    // check question's history (https call to DB)
    this.httpClient.post('https://radiant-citadel-40459.herokuapp.com/chatbot/find', questionRequestBody, httpOptions)
      .subscribe(
        (cacheResult: Question) => {
          if (cacheResult && cacheResult.answer) {
            // question found so response updated using DB file
            const botMessage = new Message(cacheResult.answer, 'bot');
            this.updateMessage(botMessage);
          } else {
            // question wasn't found in DB
            // apply dialogeflow API request
            this.client.textRequest(msg)
              .then(res => {
                const speech = res.result.fulfillment.speech;
                const botMessage = new Message(speech, 'bot');
                this.updateMessage(botMessage);
                this.updateDBCache(questionRequestBody.question, speech);
              });
          }
        }
      );
  }
  // view updated
  updateMessage(msg: Message) {
    this.conversation.next([msg]);
  }

  //  DB history updated
  updateDBCache(question, answer) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const updateDBCacheBody: Question = {
      question: question,
      answer: answer
    };
    this.httpClient.post('https://radiant-citadel-40459.herokuapp.com/chatbot/update', updateDBCacheBody, httpOptions)
      .subscribe(
        (res) => {
          console.log(res);
        }, error => console.log(error)
      );
  }
}
