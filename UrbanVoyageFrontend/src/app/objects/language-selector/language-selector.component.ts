import { Component } from '@angular/core';
import { TranslationService } from "../../services/translation.service";

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.css']
})
export class LanguageSelectorComponent {
  langs = [
    {code: 'EN', name: 'English'},
    {code: 'DE', name: 'German'},
    {code: 'FR', name: 'French'},
    {code: 'ES', name: 'Spanish'},
    {code: 'IT', name: 'Italian'},
    // Add more languages as needed
  ];

  constructor(private translationService: TranslationService) {}

  switchLang(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const lang = selectElement.value;
    this.translationService.setLanguage(lang);
  }
}
