import { Component, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { GeminiService } from './gemini.service'; // Import the GeminiService

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  boo = false;
  speech: string = '';
  voice: string = '';
  isRecording = false;
  prompt: string = '';
  geminiResponse: string = ''; // Add a property to store Gemini AI response
  private speechRecognition: any;
  starsArray: number[] = [];

  constructor(private _ngZone: NgZone, private geminiService: GeminiService) {} // Inject GeminiService

  ngOnInit() {
    this.addKeyboardListeners();
  }

   // Add keyboard event listeners
   addKeyboardListeners() {
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'a' || event.key === 'A') {
        this.startRecording();
      } else if (event.key === 's' || event.key === 'S') {
        this.stopRecording();
      } else if (event.key === 'd' || event.key === 'D') {
        this.resetTranscript();
      }
    });
  }

  initSpeechRecognition({ locale = 'en-US' }: { locale?: string } = {}): Observable<string> {
    return new Observable(observer => {
      const SpeechRecognition = (window as any)['webkitSpeechRecognition'];

      if (!SpeechRecognition) {
        observer.error('Speech Recognition is not supported in this browser.');
        return;
      }

      this.speechRecognition = new SpeechRecognition();
      this.speechRecognition.continuous = true;
      this.speechRecognition.interimResults = true;
      this.speechRecognition.lang = locale;

      this.speechRecognition.onstart = () => {
        console.log('Speech recognition started.');
      };

      this.speechRecognition.onresult = (speechRecognitionEvent: any) => {
        let interim_transcript = '';
        for (let i = speechRecognitionEvent.resultIndex; i < speechRecognitionEvent.results.length; ++i) {
          if (speechRecognitionEvent.results[i].isFinal) {
            this.boo = true;
            this._ngZone.run(() => observer.next(speechRecognitionEvent.results[i][0].transcript.trim()));
          } else {
            this.boo = false;
            interim_transcript += speechRecognitionEvent.results[i][0].transcript;
            this._ngZone.run(() => observer.next(interim_transcript.trim()));
          }
        }
      };

      this.speechRecognition.onerror = (error: any) => {
        console.error('Speech Recognition Error: ', error);
        observer.error(error);
      };

      this.speechRecognition.onend = () => {
        console.log('Speech recognition ended.');
        this.isRecording = false;
      };

      this.speechRecognition.start();

      return () => {
        if (this.speechRecognition) {
          this.speechRecognition.abort();
        }
      };
    });
  }

  startRecording() {
    if (!this.isRecording) {
      this.voice = '';
      this.speech = '';

      const SpeechRecognition = (window as any)['webkitSpeechRecognition'];

      if (!SpeechRecognition) {
        alert('Speech Recognition is not supported in this browser. Please use Chrome.');
        return;
      }

      this.isRecording = true;
      this.getTranscript().subscribe(transcript => {
        if (transcript !== '' && this.boo) {
          this.voice = this.voice + ' ' + transcript;
        } else {
          this.speech = transcript;
        }
      });
    }
  }

  async stopRecording() {
    if (this.isRecording && this.speechRecognition) {
      this.speechRecognition.stop();
      this.isRecording = false;

      try {
        // Call Gemini AI service with the transcribed speech
        const response = await this.geminiService.generateText(this.speech);
 // Access the text from the response
 const generatedText = response.candidates[0]?.content?.parts[0]?.text || 'No text available';

 this.geminiResponse = generatedText;
 console.log(this.geminiResponse);
      } catch (error) {
        console.error('Error generating text with Gemini AI:', error);
      }
    }
  }

  resetTranscript() {
    this.voice = '';
    this.speech = '';
    this.geminiResponse = ''; // Also reset Gemini response
  }

  getTranscript() {
    return this.initSpeechRecognition();
  }
}

