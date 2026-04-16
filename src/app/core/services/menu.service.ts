import { Injectable, signal } from '@angular/core';

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  iconClass?: string; // For Font Awesome class names
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
      iconClass: 'fa-solid fa-chart-line',
      route: '/',
    },
    {
          id: 'BCDR',
          label: 'BCDR',
          icon: '🔔',
          iconClass: 'fa-solid fa-bell',
          route: '/bcdrdashboard',
        },
    
    // {
    //   id: 'BCDR',
    //   label: 'BCDR',
    //   icon: '⚙️',
    //   iconClass: 'fa-solid fa-gear',
    //   route: '',
    //   children: [
    //     // {
    //     //   id: 'team',
    //     //   label: 'User',
    //     //   icon: '👨‍💼',
    //     //   iconClass: 'fa-solid fa-user-tie',
    //     //   route: '/users',
    //     // },
    //     // {
    //     //   id: 'role',
    //     //   label: 'General',
    //     //   icon: '🔧',
    //     //   iconClass: 'fa-solid fa-wrench',
    //     //   route: '/analytics',
    //     // },
    //     {
    //       id: 'BCDR',
    //       label: 'BCDR Request',
    //       icon: '🔔',
    //       iconClass: 'fa-solid fa-bell',
    //       route: '/bcdrdashboard',
    //     },
    //     // {
    //     //   id: 'security',
    //     //   label: 'Security',
    //     //   icon: '🔒',
    //     //   iconClass: 'fa-solid fa-shield',
    //     //   route: '/settings',
    //     // },
    //     // {
    //     //   id: 'test-loader',
    //     //   label: 'Test Loader',
    //     //   icon: '🧪',
    //     //   iconClass: 'fa-solid fa-vial',
    //     //   route: '/test-loader',
    //     // },
    //   ],
    // },
    // {
    //   id: 'help',
    //   label: 'Help',
    //   icon: '❓',
    //   iconClass: 'fa-solid fa-circle-question',
    //   route: '/help',
    // },
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
