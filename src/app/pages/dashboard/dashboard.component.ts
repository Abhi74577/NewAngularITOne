import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  constructor(public themeService: ThemeService) {}
  cards = [
    { title: 'Total Users', value: '12,345', icon: '👥', trend: '+12%' },
    { title: 'Revenue', value: '$45,231', icon: '💰', trend: '+8%' },
    { title: 'Orders', value: '1,234', icon: '📦', trend: '+23%' },
    { title: 'Conversion', value: '3.2%', icon: '📈', trend: '+4%' },
  ];

  recentActivity = [
    { user: 'John Doe', action: 'Created a new project', time: '2 minutes ago' },
    { user: 'Jane Smith', action: 'Updated dashboard', time: '5 minutes ago' },
    { user: 'Bob Wilson', action: 'Completed task', time: '15 minutes ago' },
    { user: 'Alice Brown', action: 'Added team member', time: '1 hour ago' },
  ];
}
