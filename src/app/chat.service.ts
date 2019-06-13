import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
// import { ApiAiClient } from 'api-ai-javascript';
import { ApiAiClient } from 'api-ai-javascript/es6/ApiAiClient';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

export class Message {
  constructor(public content: string, public sentBy: string) { }
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  readonly token = environment.dialogflow.angularBot;
  readonly client = new ApiAiClient({ accessToken: this.token });

  conversation = new BehaviorSubject<Message[]>([]);

  constructor(private httpClient: HttpClient) { }

  converse(msg: string): Observable<any> {
    const userMessage = new Message(msg, 'user');
    this.update(userMessage);
    const body = {
      question: userMessage.content
      // question: 'how do you feel?'
    };
    // check question in history

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    }
    this.httpClient.post('http://10.0.0.3:3000/chatbot/find', body, httpOptions).toPromise().then(
      (res) => {
        console.log('res =');
        console.log(res);
      }
    );
    return this.client.textRequest(msg)
      .then(res => {
        const speech = res.result.fulfillment.speech;
        const botMessage = new Message(speech, 'bot');
        this.update(botMessage);
      });
  }

  update(msg: Message) {
    this.conversation.next([msg]);
  }

}
