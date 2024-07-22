import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import {firstValueFrom, Observable, throwError} from 'rxjs';
import { SharedDataService } from './shared-data.service';
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private stripePromise: Promise<Stripe | null>;
  private apiUrl = 'http://localhost:8080/api/payment';

  constructor(
    private http: HttpClient,
    private sharedDataService: SharedDataService
  ) {
    this.stripePromise = loadStripe('pk_test_51PeM4VE38gz1e3HyUYQ85O3HMzbb8Om6jmsatVwPXPPwIITuzGx8Hy6WuSniTGM3RXT6PikF1g5Q0l29HEt7BNdc00zmZoc0IF');
    console.log('PaymentService initialized');
  }

  async createCheckoutSession(productName: string, amount: number): Promise<string> {
    console.log(`Creating checkout session for ${productName} with amount ${amount}`);
    const stripe = await this.stripePromise;

    if (!stripe) {
      console.error('Stripe failed to load');
      throw new Error('Stripe failed to load');
    }

    try {
      console.log('Sending request to create checkout session');
      const selectedReservation = this.sharedDataService.getSelectedReservation();
      const response = await firstValueFrom(
        this.http.post<{ id: string }>(`${this.apiUrl}/create-checkout-session`, {
          productName,
          amount,
          reservationId: selectedReservation?.reservationID
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

      return response.id; // Return the session ID
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  storeSessionId(sessionId: string): void {
    localStorage.setItem('stripeSessionId', sessionId);
  }

  confirmPayment(sessionId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/confirm-payment`, { sessionId }).pipe(
      catchError(error => {
        console.error('Error confirming payment:', error);
        return throwError(() => new Error('Failed to confirm payment'));
      })
    );
  }

  getPaymentStatus(sessionId: string): Promise<any> {
    return firstValueFrom(this.http.get(`${this.apiUrl}/payment-status/${sessionId}`));
  }

  handlePaymentCancellation(sessionId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/cancel-payment`, { sessionId }).pipe(
      catchError(error => {
        console.error('Error cancelling payment:', error);
        return throwError(() => new Error('Failed to cancel payment'));
      })
    );
  }

}
