import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  message = signal('');
  countries = signal<string[]>([]);
  states = signal<string[]>([]);
  selectedCountry = signal('');
  selectedState = signal('');
  
  constructor(private http: HttpClient) {}
  
  private apiUrl = 'https://your-backend-url.amazonaws.com'; // Update after backend deployment
  
  ngOnInit() {
    this.http.get(`${this.apiUrl}/api/hello`, { responseType: 'text' })
      .subscribe(response => {
        this.message.set(response);
      });
      
    this.http.get<string[]>(`${this.apiUrl}/api/countries`)
      .subscribe(response => {
        this.countries.set(response);
      });
      
    this.http.get<string[]>(`${this.apiUrl}/api/states`)
      .subscribe(response => {
        this.states.set(response);
      });
  }
  
  onCountryChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedCountry.set(target.value);
  }
  
  onStateChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedState.set(target.value);
  }
}
