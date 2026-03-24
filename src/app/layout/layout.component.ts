import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
  ],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  isSidebarExpanded = signal(true);

  toggleSidebar(): void {
    this.isSidebarExpanded.update((value) => !value);
  }

  getSidebarWidth(): string {
    return this.isSidebarExpanded() ? '280px' : '80px';
  }

  getMainMarginLeft(): string {
    return this.isSidebarExpanded() ? 'calc(280px)' : 'calc(80px)';
  }
}
