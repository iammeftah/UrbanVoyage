import { Component } from '@angular/core';

interface FAQ {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.css']
})
export class ContactPageComponent {
  faqs: FAQ[] = [
    {
      question: 'What is the cancellation policy?',
      answer: 'Our cancellation policy allows for full refunds up to 48 hours before the tour start time.',
      isOpen: false
    },
    {
      question: 'Do you offer group discounts?',
      answer: 'Yes, we offer group discounts for parties of 6 or more. Please contact us for more information.',
      isOpen: false
    },
    {
      question: 'What is included in the tour price?',
      answer: 'Our tour prices typically include transportation, guide services, and entrance fees to attractions. Meals and personal expenses are not included unless specified.',
      isOpen: false
    }
  ];

  toggleFAQ(faq: FAQ): void {
    faq.isOpen = !faq.isOpen;
  }
}
