import { Injectable, signal } from '@angular/core';

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route?: string;
  children?: MenuItem[];
  isExpanded?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private menuItems = signal<MenuItem[]>([
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      route: '/',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: '📈',
      route: '/analytics',
      children: [
        {
          id: 'reports',
          label: 'Reports',
          icon: '📄',
          route: '/analytics/reports',
        },
        {
          id: 'metrics',
          label: 'Metrics',
          icon: '📐',
          route: '/analytics/metrics',
        },
        {
          id: 'trends',
          label: 'Trends',
          icon: '📉',
          route: '/analytics/trends',
        },
      ],
    },
    {
      id: 'products',
      label: 'Products',
      icon: '🛍️',
      route: '/products',
      children: [
        {
          id: 'catalog',
          label: 'Catalog',
          icon: '📚',
          route: '/products/catalog',
        },
        {
          id: 'inventory',
          label: 'Inventory',
          icon: '📦',
          route: '/products/inventory',
        },
      ],
    },
    {
      id: 'users',
      label: 'Users',
      icon: '👥',
      route: '/users',
      children: [
        {
          id: 'team',
          label: 'Team',
          icon: '👨‍💼',
          route: '/users',
        },
        {
          id: 'permissions',
          label: 'Permissions',
          icon: '🔐',
          route: '/users/permissions',
        },
      ],
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      route: '/settings',
      children: [
        {
          id: 'general',
          label: 'General',
          icon: '🔧',
          route: '/settings/general',
        },
        {
          id: 'notifications',
          label: 'Notifications',
          icon: '🔔',
          route: '/settings/notifications',
        },
        {
          id: 'security',
          label: 'Security',
          icon: '🔒',
          route: '/settings/security',
        },
      ],
    },
    {
      id: 'help',
      label: 'Help',
      icon: '❓',
      route: '/help',
    },
  ]);

  getMenuItems() {
    return this.menuItems();
  }

  toggleMenuExpand(itemId: string): void {
    const items = this.menuItems();
    const item = this.findMenuItem(items, itemId);
    if (item && item.children) {
      item.isExpanded = !item.isExpanded;
      this.menuItems.set([...items]);
    }
  }

  private findMenuItem(items: MenuItem[], id: string): MenuItem | null {
    for (const item of items) {
      if (item.id === id) {
        return item;
      }
      if (item.children) {
        const found = this.findMenuItem(item.children, id);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }
}
