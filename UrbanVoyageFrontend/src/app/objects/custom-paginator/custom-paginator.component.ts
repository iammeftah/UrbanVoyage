import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-custom-paginator',
  template: `
    <div class="flex justify-center items-center space-x-2 mt-4">
      <button (click)="onPageChange(currentPage - 1)" [disabled]="currentPage === 1" class="px-3 py-1 rounded bg-cyan-500 text-white disabled:opacity-50">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button (click)="onPageChange(currentPage + 1)" [disabled]="currentPage === totalPages" class="px-3 py-1 rounded bg-cyan-500 text-white disabled:opacity-50">Next</button>
    </div>
  `
})
export class CustomPaginatorComponent {
  @Input() currentPage: number = 1;
  @Input() totalItems: number = 0;
  @Input() itemsPerPage: number = 10;
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }
}
