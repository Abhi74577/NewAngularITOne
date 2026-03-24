import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuService, MenuItem } from '../../core/services/menu.service';

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

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    this.menuItems.set(this.menuService.getMenuItems());
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

  getSidebarWidth(): string {
    return this.isExpanded() ? '280px' : '80px';
  }

  getLogoText(): string {
    return this.isExpanded() ? 'TechDash Pro' : 'TD';
  }
}
