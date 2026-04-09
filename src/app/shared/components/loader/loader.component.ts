import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressbarService, LoaderState } from '../../services/progressbar.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="loaderState.isLoading || loaderState.isFullPageBlock" class="loader-container">
      <!-- Full Page Block Loader -->
      <div *ngIf="loaderState.isFullPageBlock" class="loader-overlay">
        <div class="loader-spinner">
          <div class="spinner"></div>
          <p class="loader-text">Loading...</p>
        </div>
      </div>

      <!-- Progress Bar -->
      <div *ngIf="loaderState.isLoading && !loaderState.isFullPageBlock" class="progress-bar-container">
        <div class="progress-bar" [style.width.%]="loaderState.progress"></div>
      </div>
    </div>
  `,
  styles: [`
    .loader-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9999;
      pointer-events: none;
    }

    .loader-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      pointer-events: auto;
    }

    .loader-spinner {
      text-align: center;
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 15px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loader-text {
      margin: 0;
      color: #333;
      font-size: 16px;
      font-weight: 500;
    }

    .progress-bar-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: #e0e0e0;
      z-index: 9999;
    }

    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #3498db, #2ecc71);
      transition: width 0.3s ease;
      box-shadow: 0 0 10px rgba(52, 152, 219, 0.5);
    }
  `]
})
export class LoaderComponent implements OnInit, OnDestroy {
  loaderState: LoaderState = {
    isLoading: false,
    progress: 0,
    isFullPageBlock: false
  };

  private destroy$ = new Subject<void>();

  constructor(private progressbarService: ProgressbarService) { }

  ngOnInit(): void {
    this.progressbarService.loaderState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.loaderState = state;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
