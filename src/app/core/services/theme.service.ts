import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

interface ThemeColors {
  primary: string[];
  secondary: string[];
  surface: string;
  surfaceVariant: string;
  onSurface: string;
  onSurfaceVariant: string;
}

const LIGHT_THEME: ThemeColors = {
  primary: ['248, 245, 255', '243, 232, 255', '237, 214, 255', '216, 169, 255', '198, 120, 255', '177, 73, 255', '138, 43, 226', '106, 27, 154', '74, 20, 140', '51, 15, 109'],
  secondary: ['250, 245, 250', '245, 230, 245', '240, 211, 240', '229, 169, 229', '218, 130, 218', '207, 91, 207', '186, 52, 186', '164, 42, 164', '142, 23, 142', '107, 17, 107'],
  surface: '255, 255, 255',
  surfaceVariant: '245, 245, 245',
  onSurface: '31, 31, 31',
  onSurfaceVariant: '79, 79, 79',
};

const DARK_THEME: ThemeColors = {
  primary: ['248, 245, 255', '243, 232, 255', '227, 195, 255', '198, 120, 255', '177, 73, 255', '198, 120, 255', '219, 169, 255', '227, 195, 255', '235, 221, 255', '243, 232, 255'],
  secondary: ['250, 245, 250', '245, 214, 245', '229, 169, 229', '218, 130, 218', '207, 91, 207', '218, 130, 218', '229, 169, 229', '237, 208, 237', '245, 230, 245', '250, 245, 250'],
  surface: '31, 31, 31',
  surfaceVariant: '49, 49, 49',
  onSurface: '245, 245, 245',
  onSurfaceVariant: '202, 202, 202',
};

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private currentTheme = signal<Theme>('light');

  constructor() {
    this.initializeTheme();
  }

  private initializeTheme(): void {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');

    this.setTheme(theme);

    effect(() => {
      const theme = this.currentTheme();
      this.applyTheme(theme);
    });
  }

  private applyTheme(theme: Theme): void {
    const root = document.documentElement;
    const colors = theme === 'dark' ? DARK_THEME : LIGHT_THEME;

    // Apply CSS variables
    colors.primary.forEach((color, index) => {
      root.style.setProperty(`--color-primary-${(index + 1) * 100}`, color);
    });

    colors.secondary.forEach((color, index) => {
      root.style.setProperty(`--color-secondary-${(index + 1) * 100}`, color);
    });

    root.style.setProperty('--color-surface', colors.surface);
    root.style.setProperty('--color-surface-variant', colors.surfaceVariant);
    root.style.setProperty('--color-on-surface', colors.onSurface);
    root.style.setProperty('--color-on-surface-variant', colors.onSurfaceVariant);

    // Apply dark class to html element
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    localStorage.setItem('theme', theme);
  }

  getTheme(): Theme {
    return this.currentTheme();
  }

  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
  }

  toggleTheme(): void {
    const newTheme = this.currentTheme() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
}
