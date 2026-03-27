import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';
import { ClickOutsideDirective } from '../../shared/directives/click-outside.directive';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  @Input() isSidebarExpanded = signal(true);
  @Output() sidebarToggled = new EventEmitter<void>();

  isProfileDropdownOpen = signal(false);
  themeIcon = computed(() => {
    const currentTheme = this.themeService.getTheme();
    return currentTheme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  });
  themeIconEmoji = computed(() => {
    const currentTheme = this.themeService.getTheme();
    return currentTheme === 'light' ? '🌙' : '☀️';
  });

  constructor(
    public themeService: ThemeService,
    private authService: AuthService
  ) {}

  toggleSidebar(): void {
    this.sidebarToggled.emit();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleProfileDropdown(): void {
    this.isProfileDropdownOpen.update((value) => !value);
  }

  closeProfileDropdown(): void {
    this.isProfileDropdownOpen.set(false);
  }

  logout(): void {
    console.log('Logout clicked');
    this.closeProfileDropdown();
    this.authService.logout();
  }

  getThemeIcon(): string {
    return this.themeIcon();
  }
}

