import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { Subscription } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';
import { SpeechRecognitionService } from 'src/app/services/speech-recognition.service';
import { TextToSpeechService } from 'src/app/services/text-to-speech.service';
import { getListening, setListening } from 'src/app/variables';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {

  @ViewChild(MatTooltip) tooltip!: MatTooltip;

  inputMessage: string = "";
  private resultsSubscription: Subscription;

  constructor(private chatService: ChatService, private speechRecognitionService: SpeechRecognitionService, private textToSpeechService: TextToSpeechService) { 
    this.resultsSubscription = this.speechRecognitionService.onResult.subscribe((results: any) => {
      if(results.interimTranscript === '' && results.finalTranscript !== ''){
        this.sendMessage(this.inputMessage);
        this.tooltip.hide();
      } else {
        this.tooltip.show();
      }
      this.inputMessage = results.interimTranscript;
    });
  }

  ngOnInit(): void {
  }

  triggerRecording(): void {
    if (!getListening() && !this.speechRecognitionService.isPaused) {
      this.speechRecognitionService.record();
      setListening(true);
      document.getElementById("microphone-on")?.classList.remove("hidden");
      document.getElementById("microphone-off")?.classList.add("hidden");
    } else if(!getListening() && this.speechRecognitionService.isPaused){
      this.speechRecognitionService.resume();
      setListening(true);
      document.getElementById("microphone-on")?.classList.remove("hidden");
      document.getElementById("microphone-off")?.classList.add("hidden");
    } else {
      this.pauseRecording(); // Pause recording instead of stopping
      document.getElementById("microphone-on")?.classList.add("hidden");
      document.getElementById("microphone-off")?.classList.remove("hidden");
    }
  }
  
  pauseRecording(): void {
    this.speechRecognitionService.pause();
    setListening(false);
  }
  
  resumeRecording(): void {
    this.speechRecognitionService.resume();
  }
  
  ngOnDestroy(): void {
    this.resultsSubscription.unsubscribe();
    this.speechRecognitionService.stop();
  }

  sendMessage(messageSent: string): void {
    var finalMessage = "1. El texto HTML es el siguiente: " + document.getElementById('form-search')?.outerHTML + "2. Datos que hay en esta página: origen, destino, fecha de ida, fecha de vuelta, viajeros (adultos y niños), movilidad reducida y descuento. Si el usuario dice 'Buscar', pulsar SOLO el botón de submit. El usuario no tiene por qué dar todos los datos, por lo que si no los da, no te los inventes tú." + "3. Lo que el usuario quiere hacer es: " + messageSent;
    //Sending the message of the user and receiving the response from the chatbot
    this.chatService.sendMessage(finalMessage).subscribe(response => {
      try {
        eval(response.choices[0].message.content.replace("```javascript", "").replace("```",""));
      } catch (error) {
        console.error('Error executing JavaScript code:', error);
      }
    });
  }
}
