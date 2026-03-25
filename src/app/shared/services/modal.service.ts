import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ModalConfig {
  title: string;
  content?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showFooter?: boolean;
  submitButtonText?: string;
  cancelButtonText?: string;
  closeOnBackdropClick?: boolean;
}

export interface ModalData {
  config: ModalConfig;
  component?: any;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalState$ = new BehaviorSubject<ModalData | null>(null);

  getModalState(): Observable<ModalData | null> {
    return this.modalState$.asObservable();
  }

  openModal(config: ModalConfig, component?: any, data?: any): void {
    this.modalState$.next({ config, component, data });
  }

  closeModal(): void {
    this.modalState$.next(null);
  }

  isOpen(): boolean {
    return this.modalState$.value !== null;
  }
}
