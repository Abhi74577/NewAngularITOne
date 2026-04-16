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
  currentRoute = signal<string>('');
  expandedItems = signal<Set<string>>(new Set());

  constructor(
    private menuService: MenuService,
    public themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.menuItems.set(this.menuService.getMenuItems());

    this.currentRoute.set(this.router.url);
    this.autoExpandActiveParent();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute.set(event.url);
        this.autoExpandActiveParent();
      });
  }

  private autoExpandActiveParent(): void {
    const expanded = new Set<string>();
    const items = this.menuItems();
    
    const findActiveParent = (items: MenuItem[]) => {
      items.forEach(item => {
        if (this.hasActiveChild(item)) {
          expanded.add(item.id);
        }
        if (item.children) {
          findActiveParent(item.children);
        }
      });
    };
    
    findActiveParent(items);
    this.expandedItems.set(expanded);
  }

  toggleMenuExpand(itemId: string): void {
    const expanded = new Set(this.expandedItems());
    if (expanded.has(itemId)) {
      expanded.delete(itemId);
    } else {
      expanded.add(itemId);
    }
    this.expandedItems.set(expanded);
  }

  isMenuExpanded(itemId: string): boolean {
    const item = this.findMenuItemInList(itemId, this.menuItems());
    return this.expandedItems().has(itemId) || (item ? this.hasActiveChild(item) : false);
  }

  private findMenuItemInList(id: string, items: MenuItem[]): MenuItem | null {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children) {
        const found = this.findMenuItemInList(id, item.children);
        if (found) return found;
      }
    }
    return null;
  }

  setHoveredMenu(itemId: string | null): void {
    if (!this.isExpanded()) {
      this.hoveredMenuId.set(itemId);
    }
  }

  hasChildren(item: MenuItem): boolean {
    return !!item.children?.length;
  }

  handleMenuClick(event: Event, item: MenuItem): void {
    if (this.hasChildren(item)) {
      event.preventDefault();
      this.toggleMenuExpand(item.id);
    }
  }

  getSidebarWidth(): string {
    return this.isExpanded() ? '260px' : '80px';
  }

  getLogoText(): string {
    return this.isExpanded() ? 'ITOne' : 'IT';
  }

  isRouteActive(route?: string): boolean {
    if (!route) return false;
    const current = this.currentRoute();
    return current === route || current.startsWith(route + '/');
  }

  hasActiveChild(item: MenuItem): boolean {
    return item.children?.some(child => this.isRouteActive(child.route)) || false;
  }

  isItemActive(item: MenuItem): boolean {
    return this.isRouteActive(item.route) || this.hasActiveChild(item);
  }
}