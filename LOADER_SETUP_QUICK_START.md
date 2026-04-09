# Loader Setup - Quick Start

## What's Been Added

### New Files Created:
1. **`src/app/shared/services/progressbar.service.ts`** - Manages loader state globally
2. **`src/app/shared/services/test-data.service.ts`** - Provides test API endpoints
3. **`src/app/shared/components/loader/loader.component.ts`** - Global loader UI component
4. **`src/app/pages/test-loader/test-loader.component.ts`** - Demo component to test loader

### Modified Files:
1. **`src/app/app.component.ts`** - Added LoaderComponent import and template
2. **`src/app/app.routes.ts`** - Added test-loader route
3. **`src/app/shared/services/baseService.service.ts`** - Fixed error handling

---

## How to Test

### Step 1: Start Your Application
```bash
npm install
npm start
```

### Step 2: Login to Your App
Navigate to your application's login page and authenticate.

### Step 3: Go to Test Loader Page
Navigate to: `http://localhost:4200/test-loader`

You should see the Test Loader & API Component with several buttons.

### Step 4: Try Each Button

#### Button 1: "Load API Data"
- Shows a **full-page loader** with spinner
- Fetches data from free JSONPlaceholder API
- Displays posts in a table

#### Button 2: "Load Mock Data"
- Shows a **progress bar** at the top
- Simulates data loading with progress updates
- Displays 3 mock free products

#### Button 3: "Simulate Slow Request"
- Shows a **full-page loader**
- Simulates a 5-second request
- Progressively updates the progress indicator
- Shows mock data when complete

#### Button 4: "Reset Loader"
- Clears all loader states
- Resets the display

---

## Usage in Your Components

### Basic Usage:

```typescript
import { ProgressbarService } from '../../services/progressbar.service';

export class MyComponent {
  constructor(private progressbarService: ProgressbarService) {}

  // Show full page loader during API call
  loadData() {
    this.progressbarService.showProgressBlock(true);
    
    this.apiService.getData().subscribe({
      next: (data) => {
        // Hide loader
        this.progressbarService.showProgressBlock(false);
      },
      error: (error) => {
        this.progressbarService.showProgressBlock(false);
      }
    });
  }

  // Show progress bar during long operation
  slowOperation() {
    this.progressbarService.showProgress(25, true);
    // ... do work
    this.progressbarService.showProgress(100, false);
  }
}
```

---

## Loader Features

### ✅ Full Page Loader
- Semi-transparent overlay
- Centered spinning animation
- Prevents user interaction while loading

### ✅ Progress Bar
- Appears at top of page
- Smooth gradient animation
- Shows operation progress (0-100%)

### ✅ Global State Management
- Centralized via ProgressbarService
- Observable-based architecture
- Accessible from any component

### ✅ Free Test API
- JSONPlaceholder (https://jsonplaceholder.typicode.com)
- No authentication required
- Perfect for testing

---

## Loader State

**LoaderState Interface:**
```typescript
{
  isLoading: boolean;        // Is loading active
  progress: number;          // 0-100
  isFullPageBlock: boolean;  // Full page overlay visible
}
```

**Subscribe to Changes:**
```typescript
this.progressbarService.loaderState$.subscribe(state => {
  console.log('Loading:', state.isLoading);
  console.log('Progress:', state.progress);
  console.log('Full Page Block:', state.isFullPageBlock);
});
```

---

## API Methods - ProgressbarService

```typescript
// Show progress bar with value (0-100)
showProgress(progress: number, show: boolean)

// Show/hide full page blocking loader
showProgressBlock(show: boolean)

// Reset to initial state
reset()

// Get current state
getLoaderState(): LoaderState
```

---

## Examples for Your App

### Example 1: Fetch User List
```typescript
loadUsers() {
  this.progressbarService.showProgressBlock(true);
  
  this.baseService.callAPI('GET', '/users', null).subscribe({
    next: (response) => {
      const users = this.baseService.GetResponse(response, true);
      this.users = users;
      this.progressbarService.showProgressBlock(false);
    },
    error: () => {
      this.progressbarService.showProgressBlock(false);
    }
  });
}
```

### Example 2: Create New Record (POST)
```typescript
createRecord(data: any) {
  this.progressbarService.showProgressBlock(true);
  
  this.baseService.callAPI('POST', '/records', data).subscribe({
    next: (response) => {
      const result = this.baseService.GetResponse(response, true);
      this.progressbarService.showProgressBlock(false);
      this.loadRecords(); // Refresh list
    },
    error: () => {
      this.progressbarService.showProgressBlock(false);
    }
  });
}
```

### Example 3: Multi-Step Process
```typescript
async processMultipleSteps() {
  this.progressbarService.showProgressBlock(true);
  
  try {
    // Step 1
    this.progressbarService.showProgress(25, true);
    await this.step1();
    
    // Step 2
    this.progressbarService.showProgress(50, true);
    await this.step2();
    
    // Step 3
    this.progressbarService.showProgress(75, true);
    await this.step3();
    
    // Complete
    this.progressbarService.showProgress(100, false);
  } catch (error) {
    this.progressbarService.reset();
  }
}
```

---

## Troubleshooting

### Loader doesn't show?
- Check that `<app-loader></app-loader>` is in `app.component.ts`
- Verify component is in the imports array
- Check browser console for errors

### Loader appears but doesn't hide?
- Always call `showProgressBlock(false)` in error handlers too
- Call `reset()` in ngOnDestroy if component manages loading

### Test page not accessible?
- Make sure you're authenticated/logged in first
- Check that route was added to `app.routes.ts`
- Reload the page if route was just added

---

## Next Steps

1. ✅ Test the loader page (`/test-loader`)
2. ✅ Integrate into existing components
3. ✅ Customize styling in `loader.component.ts`
4. ✅ Add error handling with loader reset
5. ✅ Test with your real APIs

---

## File Locations Summary

```
src/app/
├── shared/
│   ├── services/
│   │   ├── progressbar.service.ts (⭐ NEW)
│   │   ├── test-data.service.ts (⭐ NEW)
│   │   └── baseService.service.ts (✏️ UPDATED)
│   └── components/
│       └── loader/
│           └── loader.component.ts (⭐ NEW)
├── pages/
│   └── test-loader/
│       └── test-loader.component.ts (⭐ NEW)
├── app.component.ts (✏️ UPDATED)
└── app.routes.ts (✏️ UPDATED)
```

---

## Support

For detailed usage guide, see: `LOADER_IMPLEMENTATION.md`
