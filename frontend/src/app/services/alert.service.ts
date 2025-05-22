import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Alert {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  autoClose?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSubject = new BehaviorSubject<Alert[]>([]);
  public alerts$ = this.alertSubject.asObservable();

  showSuccess(message: string, autoClose = true): void {
    this.addAlert('success', message, autoClose);
  }

  showError(message: string, autoClose = false): void {
    this.addAlert('error', message, autoClose);
  }

  showWarning(message: string, autoClose = true): void {
    this.addAlert('warning', message, autoClose);
  }

  showInfo(message: string, autoClose = true): void {
    this.addAlert('info', message, autoClose);
  }

  private addAlert(type: Alert['type'], message: string, autoClose: boolean): void {
    const alert: Alert = {
      id: Date.now().toString(),
      type,
      message,
      autoClose
    };

    const currentAlerts = this.alertSubject.value;
    this.alertSubject.next([...currentAlerts, alert]);

    if (autoClose) {
      setTimeout(() => {
        this.removeAlert(alert.id);
      }, 5000);
    }
  }

  removeAlert(id: string): void {
    const currentAlerts = this.alertSubject.value;
    const filteredAlerts = currentAlerts.filter(alert => alert.id !== id);
    this.alertSubject.next(filteredAlerts);
  }

  clearAll(): void {
    this.alertSubject.next([]);
  }
}