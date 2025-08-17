import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss'
})
export class ChatbotComponent {

  constructor(private http: HttpClient){
  }
  showQuickQuestions = true;
  quickQuestions = [
    'What is this policy about?',
    'What are the coverage options?',
    'How to claim this policy?'
  ];

  sendQuickQuestion(q: string) {
    this.userInput = q;
    this.sendMessage();
  }

  toggleQuickQuestions() {
    this.showQuickQuestions = !this.showQuickQuestions;
  }


  messages: { sender: 'bot' | 'user'; text: string }[] = [
    { sender: 'bot', text: 'Welcome! Please enter your policy number to start.' }
  ];
  userInput = '';
  policyId: string | null = null;
  isOpen = false;


  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  sendMessage() {
    const msg = this.userInput.trim();
    if (!msg) return;

    this.messages.push({ sender: 'user', text: msg });
    this.userInput = '';

    if (!this.policyId) {
      this.policyId = msg;
      this.messages.push({ sender: 'bot', text: 'Thanks! You can now continue the conversation.' });
      return;
    }

    this.http.post(`http://localhost:8000/policy_info/`, { Policy_No:(this.policyId).toString()+'.0',question: msg })
      .subscribe({
        next: (res:any) => {
          this.messages.push({ sender: 'bot', text: res.answer || 'Sorry, I didn’t get that.' });
        },
        error: () => {
          this.messages.push({ sender: 'bot', text: 'Server error. Please try again later.' });
        }
      });
  }
}
