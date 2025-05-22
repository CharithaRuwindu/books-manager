import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService, Alert } from '../../services/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class AlertComponent implements OnInit, OnDestroy {
  alerts: Alert[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private alertService: AlertService) { }

  ngOnInit(): void {
    this.subscription = this.alertService.alerts$.subscribe(
      alerts => this.alerts = alerts
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  closeAlert(id: string): void {
    this.alertService.removeAlert(id);
  }

  getAlertClass(type: string): string {
    const baseClass = 'alert alert-dismissible fade show';
    switch (type) {
      case 'success':
        return `${baseClass} alert-success`;
      case 'error':
        return `${baseClass} alert-danger`;
      case 'warning':
        return `${baseClass} alert-warning`;
      case 'info':
        return `${baseClass} alert-info`;
      default:
        return `${baseClass} alert-primary`;
    }
  }
}