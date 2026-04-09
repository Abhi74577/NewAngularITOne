# Loader Implementation Guide

## Overview
This guide explains how to use the new full-page loader and progressbar system integrated with API calls in the Angular application.

## Components & Services

### 1. **ProgressbarService** (`progressbar.service.ts`)
Manages the global loader state for the entire application.

#### Key Methods:
```typescript
// Show progress bar (0-100)
showProgress(progress: number, show: boolean): void

// Show/hide full page blocking loader
showProgressBlock(show: boolean): void

// Reset loader
reset(): void

// Get current state
getLoaderState(): LoaderState
```

#### Usage in Components:
```typescript
import { ProgressbarService } from '../../services/progressbar.service';

constructor(private progressbarService: ProgressbarService) {}

// Show full page loader
this.progressbarService.showProgressBlock(true);

// Update progress
this.progressbarService.showProgress(50, true);

// Hide loader
this.progressbarService.showProgressBlock(false);
this.progressbarService.showProgress(100, false);
```

### 2. **LoaderComponent** (`loader.component.ts`)
Global loader component that displays:
- Full page blocking loader with spinner (when `isFullPageBlock` is true)
- Progress bar (when `isLoading` is true and not full page block)

Should be added to `app.component.ts` (already done).

### 3. **TestDataService** (`test-data.service.ts`)
Provides methods to test API calls:
- `getFreeData()` - Calls JSONPlaceholder API
- `getFreeItem(id)` - Gets single item
- `getMockFreeData()` - Returns mock free products

### 4. **TestLoaderComponent** (`test-loader.component.ts`)
Demo component showing:
- Full page loader with API calls
- Progress updates
- Mock data loading
- Simulated slow requests

## Implementation Examples

### Example 1: Full Page Loader with API Call
```typescript
import { ProgressbarService } from './services/progressbar.service';

export class YourComponent {
  constructor(private progressbarService: ProgressbarService) {}

  loadData() {
    // Show full page loader
    this.progressbarService.showProgressBlock(true);

    this.apiService.getItems().subscribe({
      next: (data) => {
        this.items = data;
        // Hide loader
        this.progressbarService.showProgressBlock(false);
      },
      error: (error) => {
        console.error('Error:', error);
        this.progressbarService.showProgressBlock(false);
      }
    });
  }
}
```

### Example 2: Progress Bar with Multiple Steps
```typescript
loadDataWithProgress() {
  // Start progress
  this.progressbarService.showProgress(25, true);

  setTimeout(() => {
    this.progressbarService.showProgress(50, true);
    
    setTimeout(() => {
      this.progressbarService.showProgress(75, true);
      
      // Final completion
      this.progressbarService.showProgress(100, false);
    }, 500);
  }, 500);
}
```

### Example 3: Combining with BaseService
```typescript
import { BaseService } from './services/baseService.service';

export class YourComponent {
  constructor(private baseService: BaseService) {}

  fetchData() {
    // BaseService automatically handles loader
    this.baseService.callAPI('GET', '/api/endpoint', null)
      .subscribe({
        next: (response) => {
          const data = this.baseService.GetResponse(response, true);
          // Process data
        },
        error: (error) => {
          console.error('Error:', error);
        }
      });
  }
}
```

## Testing the Loader

### Access Test Component
Add the test component to your routes:
```typescript
import { TestLoaderComponent } from './pages/test-loader/test-loader.component';

export const routes: Routes = [
  { path: 'test-loader', component: TestLoaderComponent },
  // ... other routes
];
```

Then navigate to `/test-loader` in your browser.

### Test Scenarios in Test Component:
1. **Load API Data** - Calls free JSONPlaceholder API with full page loader
2. **Load Mock Data** - Simulates data load with progress bar
3. **Simulate Slow Request** - 5-second request with animated progress
4. **Reset Loader** - Clears all loader states

## Loader State Interface

```typescript
interface LoaderState {
  isLoading: boolean;        // Is any loading happening
  progress: number;          // Progress value (0-100)
  isFullPageBlock: boolean;  // Full page overlay active
}
```

## Styling

### Default Styles Include:
- **Full Page Loader**: Centered spinner with semi-transparent overlay
- **Progress Bar**: Top-of-page progress bar with gradient
- **Animations**: Smooth spinner rotation and progress transitions

### Customization:
Edit the styles in `loader.component.ts` to customize appearance.

## Best Practices

1. **Always Reset** - Call `progressbarService.reset()` on component destroy
2. **Handle Errors** - Always hide loader in error handlers
3. **Use Full Page Loader** for critical operations (POST, PUT, DELETE)
4. **Use Progress Bar** for GET requests or background tasks
5. **Provide Feedback** - Show success/error messages after loading completes

## Free API for Testing

The application uses JSONPlaceholder (fake JSON API) for testing:
- Base URL: `https://jsonplaceholder.typicode.com`
- Available endpoints:
  - `/posts` - Array of posts
  - `/posts/{id}` - Single post
  - No authentication required

Example response:
```json
{
  "userId": 1,
  "id": 1,
  "title": "Sample Post",
  "body": "Sample body content..."
}
```

## Integration with Existing Components

The loader works globally. Any component can trigger it:

```typescript
// In any component
constructor(private progressbarService: ProgressbarService) {}

someMethod() {
  this.progressbarService.showProgressBlock(true);
  // API call or async operation
  this.progressbarService.showProgressBlock(false);
}
```

The LoaderComponent (in app.component) will automatically display the appropriate loader overlay or progress bar.

## Troubleshooting

### Loader doesn't appear
- Verify `LoaderComponent` is imported in `app.component.ts`
- Check that `<app-loader></app-loader>` is in the template
- Ensure CSS z-index isn't being overridden

### Progress bar stuck
- Call `showProgress(100, false)` to complete
- Or call `reset()` to clear all state

### ProgressbarService not injected
- Ensure `providedIn: 'root'` in service decorator
- Add to component constructor
