import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TestDataService, FreeItem } from '../../shared/services/test-data.service';
import { ProgressbarService } from '../../shared/services/progressbar.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-test-loader',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="header">
        <h1>Test Loader & API Component</h1>
        <p>This component demonstrates the full-page loader with API calls</p>
      </div>

      <div class="buttons-section">
        <button (click)="getApiData()" class="btn btn-primary">
          Load API Data (Full Page Loader)
        </button>
        <button (click)="getMockData()" class="btn btn-secondary">
          Load Mock Data (Progress Bar)
        </button>
        <button (click)="simulateSlowRequest()" class="btn btn-info">
          Simulate Slow Request (5s)
        </button>
        <button (click)="resetLoader()" class="btn btn-warning">
          Reset Loader
        </button>
      </div>

      <div class="data-section" *ngIf="dataItems.length > 0">
        <h2>Loaded Data:</h2>
        <div class="data-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th *ngIf="isMockData">Price</th>
                <th *ngIf="isMockData">Available</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of dataItems">
                <td>{{ item.id }}</td>
                <td>{{ item.title || item.userId }}</td>
                <td>{{ (item.description || item.body) | slice:0:50 }}...</td>
                <td *ngIf="isMockData">$ {{ item.price }}</td>
                <td *ngIf="isMockData">
                  <span [class.available]="item.isAvailable" [class.unavailable]="!item.isAvailable">
                    {{ item.isAvailable ? 'Yes' : 'No' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="status-section">
        <h3>Loader Status:</h3>
        <div class="status-info">
          <p><strong>Loading:</strong> {{ isLoading }}</p>
          <p><strong>Full Page Block:</strong> {{ isFullPageBlock }}</p>
          <p><strong>Progress:</strong> {{ progress }}%</p>
          <p><strong>Items Loaded:</strong> {{ dataItems.length }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }

    .header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 2px solid #eee;
      padding-bottom: 20px;
    }

    .header h1 {
      margin: 0 0 10px 0;
      color: #333;
      font-size: 28px;
    }

    .header p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    .buttons-section {
      display: flex;
      gap: 12px;
      margin-bottom: 30px;
      flex-wrap: wrap;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .btn-primary {
      background: #3498db;
      color: white;
    }

    .btn-primary:hover {
      background: #2980b9;
    }

    .btn-secondary {
      background: #2ecc71;
      color: white;
    }

    .btn-secondary:hover {
      background: #27ae60;
    }

    .btn-info {
      background: #9b59b6;
      color: white;
    }

    .btn-info:hover {
      background: #8e44ad;
    }

    .btn-warning {
      background: #f39c12;
      color: white;
    }

    .btn-warning:hover {
      background: #e67e22;
    }

    .data-section {
      margin-bottom: 30px;
      background: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
    }

    .data-section h2 {
      margin-top: 0;
      color: #333;
      font-size: 18px;
    }

    .data-table {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    th {
      background: #3498db;
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: 600;
    }

    td {
      padding: 12px;
      border-bottom: 1px solid #eee;
      color: #333;
    }

    tr:hover {
      background: #f5f5f5;
    }

    tr:last-child td {
      border-bottom: none;
    }

    .available {
      color: #27ae60;
      font-weight: 600;
    }

    .unavailable {
      color: #e74c3c;
      font-weight: 600;
    }

    .status-section {
      background: #ecf0f1;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #3498db;
    }

    .status-section h3 {
      margin-top: 0;
      color: #333;
    }

    .status-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
    }

    .status-info p {
      margin: 0;
      background: white;
      padding: 10px;
      border-radius: 4px;
      color: #666;
      font-size: 14px;
    }

    .status-info strong {
      color: #333;
    }
  `]
})
export class TestLoaderComponent implements OnInit, OnDestroy {
  dataItems: any[] = [];
  isLoading = false;
  isFullPageBlock = false;
  progress = 0;
  isMockData = false;

  private destroy$ = new Subject<void>();

  constructor(
    private testDataService: TestDataService,
    private progressbarService: ProgressbarService
  ) { }

  ngOnInit(): void {
    // Subscribe to loader state changes
    this.progressbarService.loaderState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: any) => {
        this.isLoading = state.isLoading;
        this.isFullPageBlock = state.isFullPageBlock;
        this.progress = state.progress;
      });
  }

  /**
   * Get data from free JSON API
   */
  getApiData(): void {
    this.isMockData = false;
    this.dataItems = [];
    this.progressbarService.showProgressBlock(true);

    this.testDataService.getFreeData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.dataItems = data;
          this.progressbarService.showProgress(100, false);
          this.progressbarService.showProgressBlock(false);
        },
        error: (error: any) => {
          console.error('Error loading API data:', error);
          this.progressbarService.showProgress(100, false);
          this.progressbarService.showProgressBlock(false);
          alert('Error loading data. Check console for details.');
        }
      });
  }

  /**
   * Get mock data (no API call)
   */
  getMockData(): void {
    this.isMockData = true;
    this.dataItems = [];

    // Show progress bar
    this.progressbarService.showProgress(25, true);
    
    setTimeout(() => {
      this.progressbarService.showProgress(50, true);
      
      setTimeout(() => {
        this.progressbarService.showProgress(75, true);
        
        setTimeout(() => {
          this.dataItems = this.testDataService.getMockFreeData();
          this.progressbarService.showProgress(100, false);
        }, 500);
      }, 500);
    }, 500);
  }

  /**
   * Simulate a slow request (5 seconds)
   */
  simulateSlowRequest(): void {
    this.dataItems = [];
    this.progressbarService.showProgressBlock(true);

    // Simulate progressbar updates
    let progress = 10;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress > 90) progress = 90;
      this.progressbarService.showProgress(progress, true);
    }, 300);

    // Simulate completion after 5 seconds
    setTimeout(() => {
      clearInterval(interval);
      this.dataItems = this.testDataService.getMockFreeData();
      this.isMockData = true;
      this.progressbarService.showProgress(100, false);
      this.progressbarService.showProgressBlock(false);
    }, 5000);
  }

  /**
   * Reset loader
   */
  resetLoader(): void {
    this.progressbarService.reset();
    this.dataItems = [];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.progressbarService.reset();
  }
}
