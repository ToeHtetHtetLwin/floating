import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sorry',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sorry.component.html',
  styleUrl: './sorry.component.css'
})
export class SorryComponent implements OnInit {
  joke: string = "Loading joke..."; // Default value

  jokes: string[] = [
    "ဒီနေရာက ခင်ဗျားအိမ်မဟုတ်ဘူးလေ၊ ပြန်ထွက်သွားပါဦး။ 😂",
    "ဟတ်ကာကြီး လုပ်မလို့လား? ခဏနေဦး.. ထမင်းစားလိုက်ဦးမယ်။",
    "Scan ဖတ်တာ ဝါသနာပါရင် စာအုပ်ဆိုင်သွားဖတ်ပါ။ 📚",
    "ဒီမှာ ဘာမှမရှိဘူး၊ ကိုယ့်လမ်းကိုယ်ဆက်သွားပါတော့။"
  ];

  ngOnInit() {
    this.generateRandomJoke();
  }

  generateRandomJoke() {
    if (this.jokes.length > 0) {
      const randomIndex = Math.floor(Math.random() * this.jokes.length);
      this.joke = this.jokes[randomIndex];
    }
  }
}