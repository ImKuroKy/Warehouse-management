import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {
  @Input() notifications: any[] = [];
  @Output() closeNotifications = new EventEmitter<void>();
  private isMouseOver = false;

  onMouseEnter(): void {
    this.isMouseOver = true;
  }

  onMouseLeave(): void {
    this.isMouseOver = false;
    setTimeout(() => {
      if (!this.isMouseOver) {
        this.closeNotifications.emit();
      }
    }, 100);
  }
} 