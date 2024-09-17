import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private generativeAI: GoogleGenerativeAI;
  private api = 'AIzaSyBu2NcX-xBRxK-WiAFrY-3ZqFw8B5Hw7oo';

  constructor(private http: HttpClient) { 
    this.generativeAI = new GoogleGenerativeAI(this.api);
  }

  async generateText(prompt: string): Promise<any> {
    try {
      const model = this.generativeAI.getGenerativeModel({ model: 'gemini-1.0-pro' });
      const result = await model.generateContent(prompt);
      // const response = await result.response;
      // return response.text;
    return result.response; // Ensure this matches the expected structure
    } catch (error) {
      console.error('Error generating text:', error);
      throw error; // Rethrow to handle in component
    }
  }
}


// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { GoogleGenerativeAI } from '@google/generative-ai';

// @Injectable({
//   providedIn: 'root'
// })
// export class GeminiService {
//   private generativeAI : GoogleGenerativeAI
//   private api = 'AIzaSyBu2NcX-xBRxK-WiAFrY-3ZqFw8B5Hw7oo'

//   constructor(private http: HttpClient) { 
//     this.generativeAI = new GoogleGenerativeAI(this.api) 
//   }

//   getResponseFromGemini(voice: string): Observable<any> {
//     return this.http.post<any>(this.apiUrl, { voice });
//   }

//   async generateText(prompt: string) {
//     const model = this.generativeAI.getGenerativeModel({model:'gemini-pro'});
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text;
//     console.log(text)
//   }
// }
