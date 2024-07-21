import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private stripePromise: Promise<Stripe | null>;

  constructor(private http: HttpClient) {
    this.stripePromise = loadStripe('pk_test_51PeM4VE38gz1e3HyUYQ85O3HMzbb8Om6jmsatVwPXPPwIITuzGx8Hy6WuSniTGM3RXT6PikF1g5Q0l29HEt7BNdc00zmZoc0IF');
    console.log('PaymentService initialized');
  }

  async createCheckoutSession(productName: string, amount: number): Promise<void> {
    console.log(`Creating checkout session for ${productName} with amount ${amount}`);
    const stripe = await this.stripePromise;

    if (!stripe) {
      console.error('Stripe failed to load');
      throw new Error('Stripe failed to load');
    }

    try {
      console.log('Sending request to create checkout session');
      const response = await firstValueFrom(
        this.http.post<{ id: string }>('http://localhost:8080/api/payment/create-checkout-session', {
          productName,
          amount
        })
      );
      console.log('Received session ID:', response.id);

      console.log('Redirecting to Stripe checkout');
      const result = await stripe.redirectToCheckout({
        sessionId: response.id
      });

      if (result.error) {
        console.error('Stripe redirect error:', result.error);
        throw result.error;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }
}
