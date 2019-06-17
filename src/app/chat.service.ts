import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
// import { ApiAiClient } from 'api-ai-javascript';
import { ApiAiClient } from 'api-ai-javascript/es6/ApiAiClient';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

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

  converse(msg: string): void {
    const userMessage = new Message(msg, 'user');
    this.updateMessage(userMessage);
    const questionRequestBody = {
      question: userMessage.content
      // question: 'how do you feel?'
    };
    // check question in history

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    console.log('before post client questionRequestBody after heroku=');
    console.log(questionRequestBody);

    // this.httpClient.post('http://10.0.0.3:3000/chatbot/find', questionRequestBody, httpOptions)
    this.httpClient.post('https://radiant-citadel-40459.herokuapp.com/chatbot/find', questionRequestBody, httpOptions)
    // this.httpClient.post('https://d1325b09.ngrok.io/chatbot/find', questionRequestBody, httpOptions)
      // .pipe(
      //   map(
      //     (res) => {
      //       console.log('res =');
      //       console.log(res);
      //       const botMessage = new Message(res['answer'], 'bot');
      //       this.updateMessage(botMessage);
      //       return res;
      //     }
      //   )
      // )
      .subscribe(
        (cacheResult) => {
          console.log('cacheResult service =');
          console.log(cacheResult);
          if (false) {
            // if (cacheResult && cacheResult['answer']) {
            const botMessage = new Message(cacheResult['answer'], 'bot');
            this.updateMessage(botMessage);
          } else {
            this.client.textRequest(msg)
              .then(res => {
                const speech = res.result.fulfillment.speech;
                const botMessage = new Message(speech, 'bot');
                console.log('caching body =');
                console.log(questionRequestBody);
                console.log('res.result =');
                console.log(res.result );

                // this.updateDBCache(questionRequestBody.question, speech);
                this.updateMessage(botMessage);
              });
          }

        }
      );


    // return this.client.textRequest(msg)
    //   .then(res => {
    //     const speech = res.result.fulfillment.speech;
    //     const botMessage = new Message(speech, 'bot');
    //     this.updateMessage(botMessage);
    //   });
  }

  updateMessage(msg: Message) {
    this.conversation.next([msg]);
  }

  updateDBCache(question, answer) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    console.log('updateDBCache()');
    console.log(question);
    console.log(answer);
    const updateDBCacheBody = {
      question: question,
      answer: answer
    }
    this.httpClient.post('http://10.0.0.3:3000/chatbot/update', updateDBCacheBody, httpOptions)
      .subscribe(
        (res) => {
          console.log('updateDBCache() res =');
          console.log(res);

        }
      );
  }
}
