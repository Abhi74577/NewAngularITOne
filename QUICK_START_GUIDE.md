# Quick Start Guide - Dynamic Forms & Theme System

## 🚀 5-Minute Quick Start

### 1. Using the Theme System

```typescript
// In any component
import { ThemeService } from '../../core/services/theme.service';

export class MyComponent {
  constructor(public themeService: ThemeService) {}

  toggleTheme() {
    this.themeService.toggleTheme(); // No additional setup needed!
  }
}
```

### 2. Creating a Simple Form

```typescript
// 1. Define the form config
export const MY_FORM_CONFIG: FormConfig = {
  title: 'My Form',
  tabs: [{
    id: 'info',
    label: 'Information',
    fields: [
      {
        name: 'name',
        type: 'textbox',
        label: 'Your Name',
        required: true
      },
      {
        name: 'email',
        type: 'textbox',
        label: 'Email',
        required: true,
        validation: { email: true }
      }
    ]
  }]
};

// 2. Use in component
@Component({...})
export class MyFormComponent implements OnInit {
  formGroups: { [key: string]: FormGroup } = {};

  constructor(private dynamicFormService: DynamicFormService) {}

  ngOnInit() {
    this.formGroups = this.dynamicFormService.createTabFormGroups(
      MY_FORM_CONFIG.tabs
    );
  }

  submit() {
    const data = this.dynamicFormService.collectFormData(this.formGroups);
    console.log(data);
  }
}

// 3. Template
<form [formGroup]="formGroups['info']">
  <app-dynamic-form-renderer
    [formGroup]="formGroups['info']"
    [fields]="MY_FORM_CONFIG.tabs[0].fields"
  ></app-dynamic-form-renderer>
  <button (click)="submit()" [disabled]="!formGroups['info'].valid">
    Submit
  </button>
</form>
```

---

## Field Type Quick Reference

| Type | Code | Best For |
|------|------|----------|
| Textbox | `type: 'textbox'` | Text input, email, phone |
| Textarea | `type: 'textarea'` | Long text, descriptions |
| Select | `type: 'select'` | Single selection from list |
| MultiSelect | `type: 'multiselect'` | Multiple selections with search |
| Radio | `type: 'radio'` | Single choice with visual options |
| Checkbox | `type: 'checkbox'` | Multiple or single toggle |

---

## Common Configuration Patterns

### Pattern 1: Required Field
```typescript
{
  name: 'fieldName',
  type: 'textbox',
  label: 'Field Label',
  required: true        // ← Add this
}
```

### Pattern 2: Field with Validation
```typescript
{
  name: 'email',
  type: 'textbox',
  label: 'Email',
  required: true,
  validation: {
    email: true,        // Built-in email validation
    minLength: 5
  }
}
```

### Pattern 3: Select with Options
```typescript
{
  name: 'department',
  type: 'select',
  label: 'Department',
  required: true,
  options: [            // ← Required for select
    { label: 'Engineering', value: 'eng' },
    { label: 'Sales', value: 'sales' }
  ]
}
```

### Pattern 4: Multi-Select with Search
```typescript
{
  name: 'skills',
  type: 'multiselect',
  label: 'Skills',
  searchable: true,     // ← Enable search
  options: [
    { label: 'JavaScript', value: 'js' },
    { label: 'TypeScript', value: 'ts' }
  ]
}
```

### Pattern 5: Checkbox Options
```typescript
{
  name: 'interests',
  type: 'checkbox',
  label: 'Interests',
  options: [
    { label: 'Technology', value: 'tech' },
    { label: 'Business', value: 'business' }
  ]
}
```

### Pattern 6: Standalone Checkbox
```typescript
{
  name: 'agreeToTerms',
  type: 'checkbox',
  label: 'I agree to the terms',
  standalone: true,     // ← Single checkbox
  required: true
}
```

### Pattern 7: Radio Selection
```typescript
{
  name: 'preference',
  type: 'radio',
  label: 'Preference',
  required: true,
  options: [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' }
  ]
}
```

---

## Validation Rules

```typescript
validation: {
  // String validators
  minLength: 3,                    // Minimum characters
  maxLength: 100,                  // Maximum characters
  pattern: '^[a-zA-Z0-9]*$',       // Regex pattern
  email: true,                     // Email format
  
  // Number validators
  min: 0,                          // Minimum value
  max: 100,                        // Maximum value
  
  // Custom validator
  custom: (value) => value.length > 5
}
```

---

## Modal Quick Start

```typescript
import { ModalService } from '../../shared/services/modal.service';

export class MyComponent {
  constructor(private modalService: ModalService) {}

  openModal() {
    this.modalService.openModal({
      title: 'Add Item',
      size: 'md',
      showFooter: true,
      submitButtonText: 'Add',
      closeOnBackdropClick: true
    });
  }

  closeModal() {
    this.modalService.closeModal();
  }
}
```

---

## Styling with Theme

### Using CSS Variables in Components

```scss
.myComponent {
  background-color: rgb(var(--color-surface));
  color: rgb(var(--color-on-surface));
  border: 1px solid rgb(var(--color-on-surface-variant) / 0.3);
}

// With transparency
border-color: rgb(var(--color-primary-600) / 0.5);
```

### Using Tailwind Custom Colors

```html
<!-- Background colors -->
<div class="bg-surface">Surface color</div>
<div class="bg-surface-variant">Surface variant</div>

<!-- Text colors -->
<p class="text-on-surface">Text color</p>
<p class="text-on-surface-variant">Muted text</p>

<!-- Primary/Secondary -->
<button class="bg-primary-600 text-white">Primary Button</button>
<button class="bg-secondary-600 text-white">Secondary Button</button>
```

---

## Common Tasks

### Task 1: Create a Multi-Tab Form
```typescript
export const FORM_CONFIG: FormConfig = {
  title: 'User Form',
  tabs: [
    {
      id: 'tab1',
      label: 'Tab 1',
      fields: [/* fields */]
    },
    {
      id: 'tab2',
      label: 'Tab 2',
      fields: [/* fields */]
    }
  ]
};
```

### Task 2: Add Custom Error Message
```typescript
{
  name: 'age',
  type: 'textbox',
  label: 'Age',
  validation: { min: 18 },
  errorMessage: 'Must be 18 or older'  // ← Custom error
}
```

### Task 3: Set Default Values
```typescript
{
  name: 'status',
  type: 'select',
  label: 'Status',
  value: 'active',  // ← Default value
  options: [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' }
  ]
}
```

### Task 4: Add Help Text
```typescript
{
  name: 'password',
  type: 'textbox',
  label: 'Password',
  helpText: 'Must be at least 8 characters'  // ← Helper text
}
```

### Task 5: Make Field Read-Only
```typescript
{
  name: 'id',
  type: 'textbox',
  label: 'ID',
  readonly: true,  // ← ReadOnly
  value: '12345'
}
```

---

## File Structure for New Form

```
src/app/pages/my-form/
├── my-form.config.ts        // Form configuration
├── my-form.component.ts      // Component logic
├── my-form.component.html    // Template
├── my-form.component.scss    // Styles
└── my-form.service.ts        // Optional: API service
```

---

## Debugging Tips

### Check Form Validity
```typescript
// In template
<p>Form Valid: {{ formGroup.valid }}</p>
<p>Form Value: {{ formGroup.value | json }}</p>

// In component
console.log(this.formGroups['tabId'].valid);
console.log(this.formGroups['tabId'].errors);
```

### Check Field State
```typescript
const nameField = formGroup.get('name');
console.log('Valid:', nameField?.valid);
console.log('Touched:', nameField?.touched);
console.log('Value:', nameField?.value);
console.log('Errors:', nameField?.errors);
```

### Theme Debugging
```typescript
// Check current theme
console.log(this.themeService.getTheme());

// Check CSS variables
console.log(window.getComputedStyle(document.documentElement)
  .getPropertyValue('--color-primary-600'));
```

---

## CLI Commands

```bash
# Generate new component for form
ng g c pages/my-form --standalone

# Generate new service
ng g s shared/services/my-feature.service

# Build for production
ng build --configuration production

# Run tests
ng test

# Lint code
ng lint
```

---

## Performance Tips

1. **Use OnPush Change Detection**
   ```typescript
   @Component({
     changeDetection: ChangeDetectionStrategy.OnPush
   })
   ```

2. **Unsubscribe from Observables**
   ```typescript
   private destroy$ = new Subject<void>();
   
   ngOnInit() {
     this.data$.pipe(
       takeUntil(this.destroy$)
     ).subscribe(...);
   }
   
   ngOnDestroy() {
     this.destroy$.next();
     this.destroy$.complete();
   }
   ```

3. **Lazy Load Forms**
   ```typescript
   {
     path: 'users',
     loadComponent: () => import('./pages/user-form/user-form.component')
       .then(m => m.UserFormComponent)
   }
   ```

---

## Resources

- **Implementation Guide**: See IMPLEMENTATION_GUIDE.md for detailed docs
- **User Form Example**: src/app/pages/user-form/user-form.component.ts
- **Form Config**: src/app/pages/user-form/user-form.config.ts
- **Theme Service**: src/app/core/services/theme.service.ts

---

## Support & Issues

- Check browser console for errors
- Verify all components are standalone
- Ensure ReactiveFormsModule is imported
- Check theme CSS variables in DevTools
- Review form configuration for typos

---

**Happy Coding! 🚀**

