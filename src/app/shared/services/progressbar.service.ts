import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface LoaderState {
  isLoading: boolean;
  progress: number;
  isFullPageBlock: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProgressbarService {
  private loaderState = new BehaviorSubject<LoaderState>({
    isLoading: false,
    progress: 0,
    isFullPageBlock: false
  });

  public loaderState$: Observable<LoaderState> = this.loaderState.asObservable();

  constructor() { }

  /**
   * Show progress bar with progress value
   * @param progress - Progress value (0-100)
   * @param show - Whether to show or hide
   */
  showProgress(progress: number, show: boolean): void {
    const currentState = this.loaderState.value;
    this.loaderState.next({
      ...currentState,
      isLoading: show,
      progress: Math.min(100, Math.max(0, progress))
    });
  }

  /**
   * Show/hide full page blocking loader
   * @param show - Whether to show or hide
   */
  showProgressBlock(show: boolean): void {
    const currentState = this.loaderState.value;
    this.loaderState.next({
      ...currentState,
      isFullPageBlock: show,
      isLoading: show ? true : false
    });
  }

  /**
   * Reset loader state
   */
  reset(): void {
    this.loaderState.next({
      isLoading: false,
      progress: 0,
      isFullPageBlock: false
    });
  }

  /**
   * Get current loader state
   */
  getLoaderState(): LoaderState {
    return this.loaderState.value;
  }
}
