import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModalComponent } from './shared/components/modal/modal.component';
import { ThemeService } from './core/services/theme.service';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ModalComponent, OwlNativeDateTimeModule, OwlDateTimeModule],
  template: `
    <router-outlet></router-outlet>
    <app-modal></app-modal>
  `,
  styles: [],
})
export class AppComponent implements OnInit {
  title = 'angular-dashboard';

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // Theme service will initialize theme from localStorage on first load
  }
}
