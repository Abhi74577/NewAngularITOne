# Complete Angular Dashboard System Documentation

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Theme System](#theme-system)
4. [Form Components](#form-components)
5. [Dynamic Form System](#dynamic-form-system)
6. [Form Configuration](#form-configuration)
7. [Modal Component](#modal-component)
8. [Advanced Features](#advanced-features)
9. [Usage Examples](#usage-examples)
10. [Best Practices](#best-practices)

---

## System Overview

This Angular application features a **fully-featured dashboard system** with:

- ✅ **Theme System** - Light/Dark mode with CSS variables (localStorage persistence)
- ✅ **Dynamic Form System** - Metadata-driven form generation
- ✅ **Reusable Components** - Textbox, Textarea, Select, MultiSelect, Radio, Checkbox
- ✅ **Tab-Based Forms** - Multi-step forms with validation
- ✅ **Modal/Dialog** - Reusable modal component
- ✅ **Advanced Sidebar** - Collapsed/Expanded with floating submenus
- ✅ **Header** - Theme toggle + Profile dropdown
- ✅ **Responsive Design** - Mobile-first with Tailwind CSS

---

## Architecture

### Folder Structure

```
src/app/
├── core/
│   └── services/
│       ├── theme.service.ts        # Theme management (light/dark mode)
│       └── menu.service.ts         # Menu structure & state
├── layout/
│   ├── header/                     # Header with theme toggle
│   ├── footer/                     # Fixed footer
│   ├── sidebar/                    # Advanced sidebar with menus
│   └── layout.component.ts         # Main layout wrapper
├── pages/
│   ├── dashboard/                  # Dashboard page
│   └── user-form/                  # User form with tabs (core feature)
├── shared/
│   ├── components/
│   │   ├── form/                   # Reusable form field components
│   │   │   ├── textbox.component.ts
│   │   │   ├── textarea.component.ts
│   │   │   ├── select.component.ts
│   │   │   ├── multiselect.component.ts
│   │   │   ├── radio.component.ts
│   │   │   ├── checkbox.component.ts
│   │   │   └── index.ts           # Barrel export
│   │   ├── modal/
│   │   │   └── modal.component.ts
│   │   └── dynamic-form-renderer/
│   │       └── dynamic-form-renderer.component.ts
│   ├── directives/
│   │   └── click-outside.directive.ts
│   ├── models/
│   │   └── form-config.model.ts   # TypeScript interfaces
│   └── services/
│       ├── dynamic-form.service.ts
│       └── modal.service.ts
```

---

## Theme System

### ThemeService Features

The `ThemeService` manages theme switching with:

- **Signal-based State**: Uses Angular signals for reactive updates
- **localStorage Persistence**: Saves user preference
- **System Detection**: Falls back to OS preference (prefers-color-scheme)
- **CSS Variables Application**: Dynamically sets CSS variables

### Usage Example

```typescript
import { Component } from '@angular/core';
import { ThemeService } from '../../core/services/theme.service';

@Component({...})
export class MyComponent {
  constructor(private themeService: ThemeService) {}

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  getCurrentTheme() {
    const theme = this.themeService.getTheme();
    console.log(theme); // 'light' | 'dark'
  }
}
```

### CSS Variables

Available in both light and dark modes:

```scss
/* Primary Colors (10 shades) */
--color-primary-50 to --color-primary-900

/* Secondary Colors (10 shades) */
--color-secondary-50 to --color-secondary-900

/* Surface Colors */
--color-surface                 // Background
--color-surface-variant         // Alt background
--color-on-surface              // Text color
--color-on-surface-variant      // Muted text
```

### Applying Themes

```scss
// Use CSS variables in components
.my-component {
  background-color: rgb(var(--color-surface));
  color: rgb(var(--color-on-surface));
  border: 1px solid rgb(var(--color-on-surface-variant) / 0.3);
}

// Using Tailwind (custom colors defined in tailwind.config.js)
<div class="bg-surface text-on-surface border border-on-surface-variant/30"></div>
```

---

## Form Components

### Available Components

#### 1. **Textbox Component**
```typescript
{
  name: 'firstName',
  type: 'textbox',
  label: 'First Name',
  placeholder: 'Enter first name',
  required: true,
  validation: {
    minLength: 2,
    maxLength: 50
  }
}
```

#### 2. **Textarea Component**
```typescript
{
  name: 'biography',
  type: 'textarea',
  label: 'Biography',
  placeholder: 'Tell us about yourself',
  required: false,
  validation: {
    maxLength: 500
  }
}
```

#### 3. **Select Component** (Single Select Dropdown)
```typescript
{
  name: 'department',
  type: 'select',
  label: 'Department',
  required: true,
  options: [
    { label: 'Engineering', value: 'eng' },
    { label: 'Sales', value: 'sales' },
    { label: 'Marketing', value: 'marketing' }
  ]
}
```

#### 4. **MultiSelect Component** (Advanced)
Features:
- Search/Filter functionality
- Select All / Clear All buttons
- Search highlights matching items
- Keyboard navigation

```typescript
{
  name: 'skills',
  type: 'multiselect',
  label: 'Technical Skills',
  required: false,
  searchable: true,
  options: [
    { label: 'JavaScript', value: 'js' },
    { label: 'TypeScript', value: 'ts' },
    { label: 'React', value: 'react' },
    { label: 'Angular', value: 'angular' }
  ],
  value: ['js', 'ts'] // Pre-selected values
}
```

#### 5. **Radio Component** (Single Choice)
```typescript
{
  name: 'communicationPreference',
  type: 'radio',
  label: 'Preferred Communication',
  required: true,
  options: [
    { label: 'Email', value: 'email' },
    { label: 'Phone', value: 'phone' },
    { label: 'SMS', value: 'sms' }
  ]
}
```

#### 6. **Checkbox Component**
Standalone:
```typescript
{
  name: 'emailNotifications',
  type: 'checkbox',
  label: 'Receive email notifications',
  standalone: true,
  required: false,
  value: true
}
```

Group:
```typescript
{
  name: 'interests',
  type: 'checkbox',
  label: 'Select Interests',
  required: false,
  options: [
    { label: 'Technology', value: 'tech' },
    { label: 'Business', value: 'business' },
    { label: 'Design', value: 'design' }
  ]
}
```

---

## Dynamic Form System

### Core Concepts

The dynamic form system uses **metadata-driven approach**:

1. **FormConfig** - Overall form structure
2. **TabConfig** - Individual tab configuration
3. **FormFieldConfig** - Field definition with validation
4. **DynamicFormService** - Creates FormGroups from metadata
5. **DynamicFormRendererComponent** - Renders fields based on type

### FormFieldConfig Structure

```typescript
interface FormFieldConfig {
  name: string;                          // Unique field name
  type: FormFieldType;                   // See field types
  label: string;                         // Display label
  placeholder?: string;                  // Placeholder text
  value?: any;                           // Default value
  required?: boolean;                    // Is required
  readonly?: boolean;                    // Read-only field
  disabled?: boolean;                    // Disabled state
  validation?: {                         // Validation rules
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
    email?: boolean;
    custom?: (value: any) => boolean;
  };
  options?: FieldOption[];               // For select/radio/checkbox
  errorMessage?: string;                 // Custom error message
  helpText?: string;                     // Helper text below field
  className?: string;                    // Custom CSS class
  standalone?: boolean;                  // For checkbox (standalone)
}
```

### TabConfig Structure

```typescript
interface TabConfig {
  id: string;                    // Unique tab ID
  label: string;                 // Display label
  fields: FormFieldConfig[];     // Tab fields
  description?: string;          // Tab description
}
```

### FormConfig Structure

```typescript
interface FormConfig {
  title: string;
  description?: string;
  tabs: TabConfig[];
  submitButtonText?: string;
  cancelButtonText?: string;
  showReset?: boolean;
}
```

---

## Form Configuration

### Creating a Dynamic Form

#### Step 1: Define Configuration

```typescript
// user-form.config.ts
export const USER_FORM_CONFIG: FormConfig = {
  title: 'User Management Form',
  description: 'Complete the user information',
  submitButtonText: 'Submit',
  showReset: true,
  tabs: [
    {
      id: 'personal-info',
      label: 'Personal Information',
      fields: [
        {
          name: 'firstName',
          type: 'textbox',
          label: 'First Name',
          required: true,
          validation: { minLength: 2 }
        },
        {
          name: 'email',
          type: 'textbox',
          label: 'Email',
          required: true,
          validation: { email: true }
        }
      ]
    },
    {
      id: 'address',
      label: 'Address',
      fields: [
        {
          name: 'street',
          type: 'textbox',
          label: 'Street Address',
          required: true
        }
      ]
    }
  ]
};
```

#### Step 2: Use in Component

```typescript
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormService } from '../../shared/services/dynamic-form.service';
import { USER_FORM_CONFIG } from './user-form.config';

@Component({
  selector: 'app-user-form',
  template: `
    <div>
      <h1>{{ USER_FORM_CONFIG.title }}</h1>
      
      <!-- Tabs -->
      <div class="tabs">
        <button 
          *ngFor="let tab of USER_FORM_CONFIG.tabs"
          (click)="selectTab(tab.id)"
          [class.active]="activeTab === tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Form -->
      <form [formGroup]="formGroups[activeTab]">
        <app-dynamic-form-renderer
          [formGroup]="formGroups[activeTab]"
          [fields]="getCurrentTabFields()"
        ></app-dynamic-form-renderer>
      </form>

      <!-- Actions -->
      <button (click)="submit()" [disabled]="!isFormValid()">
        Submit
      </button>
    </div>
  `
})
export class UserFormComponent implements OnInit {
  USER_FORM_CONFIG = USER_FORM_CONFIG;
  activeTab = '';
  formGroups: { [key: string]: FormGroup } = {};

  constructor(private dynamicFormService: DynamicFormService) {}

  ngOnInit() {
    // Create form groups for all tabs
    this.formGroups = this.dynamicFormService.createTabFormGroups(
      USER_FORM_CONFIG.tabs
    );
    this.activeTab = USER_FORM_CONFIG.tabs[0].id;
  }

  selectTab(tabId: string) {
    this.activeTab = tabId;
  }

  getCurrentTabFields() {
    const tab = USER_FORM_CONFIG.tabs.find(t => t.id === this.activeTab);
    return tab?.fields || [];
  }

  isFormValid() {
    return Object.values(this.formGroups).every(group => group.valid);
  }

  submit() {
    if (this.isFormValid()) {
      const data = this.dynamicFormService.collectFormData(this.formGroups);
      console.log('Form Data:', data);
    }
  }
}
```

---

## Modal Component

### ModalService

```typescript
import { ModalService } from '../../shared/services/modal.service';

constructor(private modalService: ModalService) {}

// Open Modal
openModal() {
  this.modalService.openModal({
    title: 'Add New User',
    size: 'md',
    showFooter: true,
    submitButtonText: 'Add User',
    cancelButtonText: 'Cancel',
    closeOnBackdropClick: true
  });
}

// Close Modal
closeModal() {
  this.modalService.closeModal();
}

// Check if open
if (this.modalService.isOpen()) {
  // Modal is open
}
```

### Modal Sizes

- `sm` - 448px (28rem)
- `md` - 576px (36rem) - Default
- `lg` - 768px (48rem)
- `xl` - 896px (56rem)

### Using Modal with Forms

```typescript
// In your component
openAddUserModal() {
  this.modalService.openModal({
    title: 'Add New User',
    size: 'lg',
    showFooter: true,
    submitButtonText: 'Add'
  }, UserFormComponent, { mode: 'add' });
}
```

---

## Advanced Features

### 1. Form Validation

#### Built-in Validators

```typescript
validation: {
  email: true,                    // Email validation
  minLength: 3,                   // Minimum length
  maxLength: 100,                 // Maximum length
  min: 0,                         // Minimum value
  max: 100,                       // Maximum value
  pattern: '^[a-zA-Z0-9]*$'     // Regex pattern
}
```

#### Custom Validators

```typescript
validation: {
  custom: (value: any) => {
    return value && value.length > 5;
  }
}
```

### 2. Conditional Fields

Create a wrapper service to handle conditional logic:

```typescript
// Define conditions
type FieldCondition = (formData: any) => boolean;

// Show password confirmation only if password is filled
{
  name: 'confirmPassword',
  type: 'textbox',
  label: 'Confirm Password',
  condition: (data) => !!data['password']
}
```

### 3. Dynamic Options

Load options from API:

```typescript
ngOnInit() {
  this.loadDepartments().subscribe(departments => {
    const departmentField = this.config.tabs[0].fields.find(
      f => f.name === 'department'
    );
    if (departmentField) {
      departmentField.options = departments;
    }
  });
}
```

### 4. Form State Management

```typescript
// Save form state to localStorage
saveFormState() {
  const state = this.dynamicFormService.collectFormData(this.formGroups);
  localStorage.setItem('formState', JSON.stringify(state));
}

// Restore form state
loadFormState() {
  const saved = localStorage.getItem('formState');
  if (saved) {
    try {
      const state = JSON.parse(saved);
      Object.keys(this.formGroups).forEach(tabId => {
        this.formGroups[tabId].patchValue(state[tabId] || {});
      });
    } catch (e) {
      console.error('Failed to load form state', e);
    }
  }
}
```

### 5. Sidebar Advanced Features

#### Collapsed State
- Shows only icons (80px width)
- Hover over parent → shows floating submenu

#### Expanded State
- Shows full text (280px width)
- Click parent → expands/collapses children inline
- Visual indicator (chevron rotation)

#### Responsive
- Auto-collapse on mobile screens
- Touch-friendly interactions

---

## Usage Examples

### Example 1: Simple Contact Form

```typescript
export const CONTACT_FORM_CONFIG: FormConfig = {
  title: 'Contact Us',
  tabs: [
    {
      id: 'contact',
      label: 'Contact Information',
      fields: [
        {
          name: 'name',
          type: 'textbox',
          label: 'Full Name',
          required: true,
          placeholder: 'John Doe'
        },
        {
          name: 'email',
          type: 'textbox',
          label: 'Email Address',
          required: true,
          validation: { email: true },
          placeholder: 'john@example.com'
        },
        {
          name: 'message',
          type: 'textarea',
          label: 'Message',
          required: true,
          placeholder: 'Your message here...',
          validation: { minLength: 10, maxLength: 1000 }
        }
      ]
    }
  ]
};
```

### Example 2: Product Configuration Form

```typescript
export const PRODUCT_CONFIG: FormConfig = {
  title: 'Product Configuration',
  tabs: [
    {
      id: 'basic',
      label: 'Basic Info',
      fields: [
        {
          name: 'productName',
          type: 'textbox',
          label: 'Product Name',
          required: true
        },
        {
          name: 'price',
          type: 'textbox',
          label: 'Price',
          required: true,
          validation: { pattern: '^\\d+(\\.\\d{1,2})?$' }
        }
      ]
    },
    {
      id: 'details',
      label: 'Details',
      fields: [
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          required: true
        },
        {
          name: 'category',
          type: 'select',
          label: 'Category',
          required: true,
          options: [
            { label: 'Electronics', value: 'electronics' },
            { label: 'Clothing', value: 'clothing' },
            { label: 'Books', value: 'books' }
          ]
        }
      ]
    }
  ]
};
```

### Example 3: Multi-Select with Search

```typescript
{
  name: 'technologies',
  type: 'multiselect',
  label: 'Preferred Technologies',
  searchable: true,
  required: true,
  options: [
    { label: 'React', value: 'react' },
    { label: 'Angular', value: 'angular' },
    { label: 'Vue.js', value: 'vue' },
    { label: 'Svelte', value: 'svelte' },
    { label: 'Next.js', value: 'nextjs' }
  ]
}
```

---

## Best Practices

### 1. Component Organization

```
Features/
├── shared/
│   ├── components/
│   │   └── form/         # All form fields together
│   ├── models/           # Interfaces & types
│   └── services/         # Shared logic
├── core/
│   └── services/         # App-level services
└── pages/
    └── specific-form/    # Feature-specific forms
```

### 2. Field Configuration

- **Keep it Simple**: Only required fields in defaultconfig
- **Validation Early**: Define validation rules with fields
- **Help Text**: Always provide help text for complex fields
- **Default Values**: Set sensible defaults

### 3. Form Performance

```typescript
// Use OnPush change detection for form components
@Component({
  selector: 'app-user-form',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFormComponent {}
```

### 4. Error Handling

```typescript
// Provide meaningful error messages
{
  name: 'email',
  type: 'textbox',
  label: 'Email',
  errorMessage: 'Please enter a valid email address',
  validation: { email: true }
}
```

### 5. Accessibility

- All form fields have labels
- Error messages are associated with fields
- Keyboard navigation supported
- ARIA attributes for screen readers

### 6. Styling & Theming

- Always use CSS variables for colors
- Support both light and dark modes
- Use Tailwind utilities for responsive design
- Maintain consistent spacing

```scss
// Good
.form-field {
  color: rgb(var(--color-on-surface));
  background-color: rgb(var(--color-surface));
  border: 1px solid rgb(var(--color-on-surface-variant) / 0.3);
}

// Avoid
.form-field {
  color: #333;
  background-color: white;
  border: 1px solid #ccc;
}
```

### 7. Testing

```typescript
// Test form configuration
it('should create form groups from config', () => {
  const service = TestBed.inject(DynamicFormService);
  const groups = service.createTabFormGroups(USER_FORM_CONFIG.tabs);
  
  expect(Object.keys(groups).length).toBe(USER_FORM_CONFIG.tabs.length);
  expect(groups['personal-info']).toBeInstanceOf(FormGroup);
});

// Test field validation
it('should validate required fields', () => {
  const group = service.createFormGroup(tabFields);
  expect(group.valid).toBe(false);
  
  group.get('firstName')?.setValue('John');
  expect(group.valid).toBe(false); // Still other required fields
});
```

---

## Integration Checklist

- ✅ ThemeService injected in AppComponent
- ✅ ModalComponent in AppComponent template
- ✅ UserFormComponent route configured
- ✅ CSS variables defined globally
- ✅ Form components imported in lazy-loaded modules
- ✅ DynamicFormService provided at root
- ✅ Menu items configured in MenuService
- ✅ Responsive styling with Tailwind
- ✅ Theme toggle in header
- ✅ Sidebar expand/collapse working

---

## Troubleshooting

### Theme not changing
- Check if `localStorage` is enabled
- Verify CSS variables are applied to `:root`
- Check browser console for errors

### Form fields not rendering
- Verify field type matches available components
- Check FormControl is properly initialized
- Ensure ReactiveFormsModule is imported

### Modal not showing
- ModalComponent must be in AppComponent template
- ModalService must be injected
- Check z-index conflicts with other elements

### Validation not working
- Verify validation rules in FormFieldConfig
- Check FormGroup is properly created
- Test with form.valid in template

---

## Next Steps

1. **Extend Components**: Add new field types as needed
2. **API Integration**: Connect forms to backend APIs
3. **State Management**: Add NgRx or Signals for complex state
4. **Accessibility**: Run WCAG compliance audit
5. **Performance**: Add lazy loading for large forms
6. **Testing**: Expand test coverage

