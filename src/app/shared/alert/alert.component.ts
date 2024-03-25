import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent {
  @Input() errorAlertMsg = '';
  @Output() closeAlert = new EventEmitter<void>();

  onClose(){
    this.closeAlert.emit();
  }
}
