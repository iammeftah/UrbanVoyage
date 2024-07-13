import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-message',
  template: `
    <div *ngIf="message"
         class="flex flex-row gap-4 items-center justify-center fixed top-4 right-4 p-4 rounded-md shadow-md text-white z-50 max-w-[100%] "
         [ngClass]="{'bg-green-500': type === 'success', 'bg-red-500': type === 'error'}"
         data-aos="fade-left">
      <i (click)="closeMessage()" class="bx bx-x cursor-pointer"></i>
      {{ message }}
    </div>
  `,
  styles: []
})
export class MessageComponent implements OnInit, OnDestroy {
  @Input() message: string | null = null;
  @Input() type: 'success' | 'error' = 'success';
  @Output() close = new EventEmitter<void>();

  private timer: any; // Hold reference to the timer

  ngOnInit() {
    // Automatically close message after 3 seconds if it is open
    if (this.message) {
      this.timer = setTimeout(() => {
        this.closeMessage();
      }, 3000);
    }
  }

  ngOnDestroy() {
    // Clean up the timer to avoid memory leaks
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  closeMessage() {
    this.message = null;
    this.close.emit();
  }
}
