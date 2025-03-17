import { Component, Input, Output, EventEmitter } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-modal",
  standalone: true,
  imports: [CommonModule],
  template: `
  <div *ngIf="isOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" (click)="closeModal()">
    <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white" (click)="$event.stopPropagation()">
      <div class="mt-3">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">{{ title }}</h3>
        <div class="mt-2 px-7 py-3">
          <ng-content></ng-content>
        </div>
        <div class="items-center px-4 py-3">
          <button (click)="closeModal()" class="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
`,
})
export class ModalComponent {
  @Input() isOpen = false
  @Input() title = ""
  @Output() close = new EventEmitter<void>()

  closeModal() {
    this.close.emit()
  }
}

