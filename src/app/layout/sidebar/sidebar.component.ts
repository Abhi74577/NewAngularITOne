import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { MenuService, MenuItem } from '../../core/services/menu.service';
import { ThemeService } from '../../core/services/theme.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  @Input() isExpanded = signal(true);

  menuItems = signal<MenuItem[]>([]);
  hoveredMenuId = signal<string | null>(null);
  hoveredSubmenuId = signal<string | null>(null);
  currentRoute = signal<string>('');

  constructor(private menuService: MenuService, public themeService: ThemeService, private router: Router) {}

  ngOnInit(): void {
    this.menuItems.set(this.menuService.getMenuItems());
    
    // Set initial route
    this.currentRoute.set(this.router.url);
    this.autoExpandActiveParent();
    
    // Subscribe to router events to update current route
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.currentRoute.set(event.url);
          this.autoExpandActiveParent();
        }
      });
  }

  /**
   * Auto-expand parent menus if a child route is active
   */
  private autoExpandActiveParent(): void {
    const items = this.menuItems();
    items.forEach((item) => {
      if (this.hasActiveChild(item)) {
        item.isExpanded = true;
      }
    });
    this.menuItems.set([...items]);
  }

  toggleMenuExpand(itemId: string): void {
    this.menuService.toggleMenuExpand(itemId);
    this.menuItems.set(this.menuService.getMenuItems());
  }

  setHoveredMenu(itemId: string | null): void {
    if (!this.isExpanded()) {
      this.hoveredMenuId.set(itemId);
    }
  }

  hasChildren(item: MenuItem): boolean {
    return !!(item.children && item.children.length > 0);
  }

  handleMenuClick(event: Event, item: MenuItem): void {
    // If item has children and sidebar is expanded, toggle menu and prevent navigation
  
      event.preventDefault();
      this.toggleMenuExpand(item.id);
    
    // Otherwise, allow normal routerLink navigation
  }

  getSidebarWidth(): string {
    return this.isExpanded() ? '250px' : '80px';
  }

  getLogoText(): string {
    return this.isExpanded() ? 'TechDash Pro' : 'TD';
  }

  /**
   * Check if a menu item route is active
   */
  isRouteActive(route?: string): boolean {
    if (!route) return false;
    const currentUrl = this.currentRoute();
    return currentUrl === route || currentUrl.startsWith(route + '/');
  }

  /**
   * Check if a menu item has any active children
   */
  hasActiveChild(item: MenuItem): boolean {
    if (!item.children) return false;
    return item.children.some((child) => this.isRouteActive(child.route));
  }

  /**
   * Check if a menu item or its parent is active
   */
  isItemActive(item: MenuItem): boolean {
    return this.isRouteActive(item.route) || this.hasActiveChild(item);
  }
}
